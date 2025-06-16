import { TestBed } from '@angular/core/testing';

import { UrlConfigServiceService } from './url-config-service.service';

describe('UrlConfigServiceService', () => {
  let service: UrlConfigServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlConfigServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
