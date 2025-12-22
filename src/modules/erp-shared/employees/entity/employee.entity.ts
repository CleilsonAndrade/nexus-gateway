import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'PCEMPR',
})
export class EmployeeEntity {
  @PrimaryColumn({
    name: 'MATRICULA',
  })
  registration: string;

  @Column({
    name: 'CPF',
    type: 'varchar2',
    length: 20,
    unique: true,
  })
  cpf: string;

  @Column({
    name: 'CODFILIAL',
    type: 'number',
    nullable: true,
  })
  codBranch: number;

  @Column({
    name: 'CODSETOR',
    type: 'number',
  })
  codSector: number;

  @Column({
    name: 'NOME_GUERRA',
    type: 'varchar2',
    length: 15,
  })
  nameWar: string;

  @Column({
    name: 'SITUACAO',
    type: 'varchar2',
    length: 1,
    default: 'A',
  })
  situation: string;

  @Column({
    name: 'AREAATUACAO',
    type: 'varchar2',
    length: 40,
  })
  areaActing: string;
}
