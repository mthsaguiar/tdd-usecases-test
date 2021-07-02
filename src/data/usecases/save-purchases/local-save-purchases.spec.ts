import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'

class CacheStoreSpy implements CacheStore {
    key: string | undefined
    deleteCallsCount = 0;
    delete(key: string): void{
        this.deleteCallsCount++;
        this.key = key;
    }
}
type SutTypes = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes =>{
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    return {
        sut,
        cacheStore
    }
}

//sut => system under test
describe('LocalSavePurchases', ()=>{
   test('Should not delete cache on sut.init', ()=>{
        const {cacheStore} = makeSut();
        expect(cacheStore.deleteCallsCount).toBe(0)
   })

    test('Should delete old cache on sut.save ', async ()=>{
        const { cacheStore, sut } = makeSut();
        await sut.save()
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.key).toBe('purchases')
    })
})
