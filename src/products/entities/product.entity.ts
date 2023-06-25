import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';


@Entity()
export class Product {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string

    @Column('float', {
        default: 0
    })
    price: number;
    
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column({
        unique: true
    })
    slug: string;


    @Column('float',{
        default: 0
    })
    stock: number
    
    @Column('text',{
        array: true
    })
    sizes: string[]
    
    @Column()
    gender: string

    @Column('text', {
        array: true, 
        default: []
    })
    tags: string[]
    
    @OneToMany(
        () => ProductImage, 
        (productImage) => productImage.product, 
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @BeforeInsert()
    checkSlugInsert(){

      if ( !this.slug ){
       this.slug = this.title
      }

      this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkslugUpdate() {

        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')

    }
    
}
