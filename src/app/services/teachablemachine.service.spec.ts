import { TestBed } from '@angular/core/testing';

import { TeachablemachineService } from './teachablemachine.service';

describe('TeachablemachineService', () => {
  let service: TeachablemachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeachablemachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
