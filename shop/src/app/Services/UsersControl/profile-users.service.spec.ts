import { TestBed } from '@angular/core/testing';

import { ProfileUsersService } from './profile-users.service';

describe('ProfileFormUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileUsersService = TestBed.get(ProfileUsersService);
    expect(service).toBeTruthy();
  });
});
