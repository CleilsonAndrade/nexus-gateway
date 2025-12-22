import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'PCFILIAL',
})
export class CompanyBranchEntity {
  @PrimaryColumn({
    name: 'CODIGO',
    type: 'varchar2',
    nullable: false,
    length: 2,
  })
  codeBranch: string;

  @Column({
    name: 'CGC',
    type: 'varchar2',
    length: 14,
  })
  cnpj: string;
}
