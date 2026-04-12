import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let executionContextMock: ExecutionContext;
  let callHandlerMock: CallHandler;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
    executionContextMock = {} as ExecutionContext;
  });

  it('should wrap successful responses in a standard envelope', (done) => {
    const mockData = { id: 1, name: 'Test' };
    callHandlerMock = {
      handle: () => of(mockData),
    };

    interceptor.intercept(executionContextMock, callHandlerMock).subscribe({
      next: (result) => {
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('data', mockData);
        expect(result).toHaveProperty('timestamp');
        expect(new Date(result.timestamp).getTime()).not.toBeNaN();
      },
      complete: () => done(),
    });
  });

  it('should handle null data properly in the envelope', (done) => {
    callHandlerMock = {
      handle: () => of(null),
    };

    interceptor.intercept(executionContextMock, callHandlerMock).subscribe({
      next: (result) => {
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('data', null);
        expect(result).toHaveProperty('timestamp');
      },
      complete: () => done(),
    });
  });

  it('should handle array data properly in the envelope', (done) => {
    const mockArray = [1, 2, 3];
    callHandlerMock = {
      handle: () => of(mockArray),
    };

    interceptor.intercept(executionContextMock, callHandlerMock).subscribe({
      next: (result) => {
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('data', mockArray);
        expect(result).toHaveProperty('timestamp');
      },
      complete: () => done(),
    });
  });
});
