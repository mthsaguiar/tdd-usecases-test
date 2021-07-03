import { mockPurchases, CacheStoreSpy } from '@/data/tests'
import { LocalLoadPurchases } from './local-load-purchases'



type SutTypes = {
    sut: LocalLoadPurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (timestamp= new Date()): SutTypes =>{
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamp)
    return {
        sut,
        cacheStore
    }
}
//sut => system under test
describe('LocalLoadPurchases', ()=>{
   test('Should not delete or insert cache on sut.init', ()=>{
        const {cacheStore} = makeSut();
        expect(cacheStore.actions).toEqual([]);
   })


    test('Should not insert new Cache if delete fails', async ()=>{
        const { cacheStore, sut } = makeSut();
        cacheStore.siulateDeleteError();
        const promise = sut.save(mockPurchases());
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete]);
        await expect(promise).rejects.toThrow();
    })

    test('Should insert new Cache if delete succeeds', async ()=>{
        const timestamp = new Date()
        const { cacheStore, sut } = makeSut();
        const purchases = mockPurchases();
        const promise = sut.save(purchases);
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert]);
        expect(cacheStore.deleteKey).toBe('purchases');
        expect(cacheStore.insertKey).toBe('purchases');
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases
        });
        await expect(promise).resolves.toBeFalsy()
    })
    test('Should throw if insert throws', async ()=>{
        const { cacheStore, sut } = makeSut();
        cacheStore.siulateInsertError();
        const promise = sut.save(mockPurchases());
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        await expect(promise).rejects.toThrow();
    })
})
