import { APP_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/constants';
import request from 'supertest';
import { RoleEnum } from '../../src/roles/roles.enum';
import { StatusEnum } from '../../src/statuses/statuses.enum';

describe('Users Module', () => {
  const app = APP_URL;
  let apiToken;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ body }) => {
        apiToken = body.token;
      });
  });

  describe('Update', () => {
    let user1, user2;
    const email1 = `user-one.${Date.now()}@example.com`;
    const email2 = `user-two.${Date.now()}@example.com`;
    const password = `secret`;

    beforeAll(async () => {
      await request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: email1,
          password,
          firstName: `UserOne`,
          lastName: 'E2E',
        })
        .then(({ body }) => {
          user1 = body.user;
        });

      await request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: email2,
          password,
          firstName: `UserTwo`,
          lastName: 'E2E',
        })
        .then(({ body }) => {
          user2 = body.user;
        });
    });

    describe('User with "Admin" role', () => {
      it('should update email for existing user', () => {
        return request(app)
          .patch(`/api/v1/users/${user1.id}`)
          .auth(apiToken, { type: 'bearer' })
          .send({
            email: `updated-${email1}`,
          })
          .expect(200);
      });

      it('should fail to update with existing email', () => {
        return request(app)
          .patch(`/api/v1/users/${user2.id}`)
          .auth(apiToken, { type: 'bearer' })
          .send({
            email: email1,
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Email already exists');
          });
      });
    });
  });

  describe('Create', () => {
    const newUserByAdminEmail = `user-created-by-admin.${Date.now()}@example.com`;
    const newUserByAdminPassword = `secret`;

    describe('User with "Admin" role', () => {
      it('should successfully create new user: /api/v1/users (POST)', () => {
        return request(app)
          .post(`/api/v1/users`)
          .auth(apiToken, {
            type: 'bearer',
          })
          .send({
            email: newUserByAdminEmail,
            password: newUserByAdminPassword,
            firstName: `UserByAdmin${Date.now()}`,
            lastName: 'E2E',
            role: {
              id: RoleEnum.user,
            },
            status: {
              id: StatusEnum.active,
            },
          })
          .expect(201);
      });

      describe('Guest', () => {
        it('should successfully login via created by admin user: /api/v1/auth/email/login (GET)', () => {
          return request(app)
            .post('/api/v1/auth/email/login')
            .send({
              email: newUserByAdminEmail,
              password: newUserByAdminPassword,
            })
            .expect(200)
            .expect(({ body }) => {
              expect(body.token).toBeDefined();
            });
        });
      });
    });
  });

  describe('Get many', () => {
    describe('User with "Admin" role', () => {
      it('should get list of users: /api/v1/users (GET)', () => {
        return request(app)
          .get(`/api/v1/users`)
          .auth(apiToken, {
            type: 'bearer',
          })
          .expect(200)
          .send()
          .expect(({ body }) => {
            expect(body.data[0].provider).toBeDefined();
            expect(body.data[0].email).toBeDefined();
            expect(body.data[0].hash).not.toBeDefined();
            expect(body.data[0].password).not.toBeDefined();
          });
      });
    });
  });
});
