import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'
import { SavePurchases } from '@/domain';

class CacheStoreSpy implements CacheStore {
    deleteKey: string | undefined
    insertKey: string | undefined
    deleteCallsCount = 0;
    insertCallsCount = 0;
    insertValues: Array<SavePurchases.Params> = [];

    delete(deleteKey: string): void{
        this.deleteCallsCount++;
        this.deleteKey = deleteKey;
    }
    insert(key: string, value: any): void {
        this.insertCallsCount++;
        this.insertKey = key
        this.insertValues = value;
    }
    siulateDeleteError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(()=>{throw new Error()});
    }
    siulateInsertError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(()=>{throw new Error()});
    }
}
const mockPurchases = () :Array<SavePurchases.Params> =>[
    {
        id: '1',
        date: new Date(),
        value: 10
    },
    {
        id: '2',
        date: new Date(),
        value: 20
    },
]
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
        expect(cacheStore.deleteCallsCount).toBe(0);
   })

    test('Should delete old cache on sut.save ', async ()=>{
        const { cacheStore, sut } = makeSut();
        await sut.save(mockPurchases())
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.deleteKey).toBe('purchases');
    })
    test('Should not insert new Cache if delete fails', async ()=>{
        const { cacheStore, sut } = makeSut();
        cacheStore.siulateDeleteError();
        const promise = sut.save(mockPurchases());
        expect(cacheStore.insertCallsCount).toBe(0);
        expect(promise).rejects.toThrow();
    })

    test('Should insert new Cache if delete succeeds', async ()=>{
        const { cacheStore, sut } = makeSut();
        const purchases = mockPurchases();
        await sut.save(purchases);
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.insertCallsCount).toBe(1);
        expect(cacheStore.insertValues).toEqual(purchases);
    })
    test('Should throw if insert throws', async ()=>{
        const { cacheStore, sut } = makeSut();
        cacheStore.siulateInsertError();
        const promise = sut.save(mockPurchases());
        expect(promise).rejects.toThrow();
    })
})
