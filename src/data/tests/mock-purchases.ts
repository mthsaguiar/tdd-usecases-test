import { SavePurchases } from "@/domain/usecases";
import { DH_UNABLE_TO_CHECK_GENERATOR } from "constants";
import faker from 'faker';

export const mockPurchases = () :Array<SavePurchases.Params> =>[
    {
        id: faker.datatype.uuid(),
        date: faker.date.recent(),
        value: faker.datatype.number()
    },
    {
        id: faker.datatype.uuid(),
        date: faker.date.recent(),
        value: faker.datatype.number()
    },
]