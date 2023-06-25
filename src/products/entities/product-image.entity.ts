import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./entity";


@Entity()
export class ProductImage {


    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string
    
    @ManyToOne(
        () => Product,
        ( product ) => product.images, 
        { onDelete: 'CASCADE' }
    )
    product: Product 

}