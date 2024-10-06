export interface IProduct {
    id?: string;
    title: string;
    slug: string;
    description: string;
    stock: number;
    price: number;
    sizes: ISize[];
    images: string[];
    tags: string[];
    type: IType;
    gender: 'men'|'women'|'kid'|'unisex'

    // TODO: agregar createdAt y updatedAt
    createdAt?: string;
    updatedAt?: string;

}

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';