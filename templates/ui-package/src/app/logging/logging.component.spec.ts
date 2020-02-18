import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoggingComponent} from './logging.component';
import {NgxCoreServicesModule, LoggingService} from '@labshare/ngx-core-services';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs';
describe('LoggingComponent', () => {
  let component: LoggingComponent;
  let fixture: ComponentFixture<LoggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LoggingService,
          useValue: {
            error(...args) {
              return true;
            },
            info(...args) {
              return of({});
            },
            hasUrl() {
              return true;
            }
          }
        }
      ],
      declarations: [LoggingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
