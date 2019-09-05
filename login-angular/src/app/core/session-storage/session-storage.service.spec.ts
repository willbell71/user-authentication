import { SessionStorageService } from './session-storage.service';

describe('SessionService', () => {
  let service: SessionStorageService;
  let clearSpy: jasmine.Spy;
  let removeItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;
  let getItemSpy: jasmine.Spy;

  beforeEach(() => {
    service = new SessionStorageService();

    clearSpy = spyOn(window.sessionStorage, 'clear').and.callFake(() => {});
    removeItemSpy = spyOn(window.sessionStorage, 'removeItem').and.callFake(() => {});
    setItemSpy = spyOn(window.sessionStorage, 'setItem').and.callFake(() => {});
    getItemSpy = spyOn(window.sessionStorage, 'getItem').and.callFake(() => 'value');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('clear', () => {
    it('should call clear', () => {
      service.clear();

      expect(clearSpy).toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should call removeItem with the key', () => {
      service.removeItem('item');

      expect(removeItemSpy).toHaveBeenCalledWith('item');
    });
  });

  describe('setItem', () => {
    it('should call setItem with the key and value', () => {
      service.setItem('item', 'value');

      expect(setItemSpy).toHaveBeenCalledWith('item', 'value');
    });
  });

  describe('getItem', () => {
    it('should call getItem with the key', () => {
      service.getItem('item');

      expect(getItemSpy).toHaveBeenCalledWith('item');
    });

    it('should return the value', () => {
      const value = service.getItem('item');

      expect(value).toEqual('value');
    });
  });
});
