/* tslint:disable:typedef */
import {AfterViewInit, Component, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ConfigService} from '../config/config.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface PeriodicElement {
  id: string;
  nik: string;
  name: string;
  division: string;
  divisionId: number;
  position: string;
  positionId: number;
  type: string;
  last_position: string;
  created_date: string;
  button: any;
}
export interface Position {
  id: number;
  level: number;
  name: string;
}
export interface Division {
  id: number;
  name: string;
}
export interface Employees {
  createdDate: string;
  divisionId: number;
  id: number;
  lastPosition: string;
  name: string;
  nik: string;
  positionId: number;
  type: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'nik', 'name', 'division', 'position', 'type', 'lastPosition', 'createdDate'];
  dataEmployees: any;
  dataSource = new MatTableDataSource<PeriodicElement>();

  divisionList = [];
  positionList = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: ConfigService, private _snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<any> {
    await this.service.getDivisions().then((res: any) => {
      this.divisionList = res;
    });
    await this.service.getPositions().then((res: any) => {
      this.positionList = res;
    });
    return this.service.getData().then((res: any) => {
      const data = res.map((t: Employees) => {
        return {
          ...t,
          position: this.positionList.filter(a => a.id === t.positionId)[0].name,
          division: this.divisionList.filter(a => a.id === t.divisionId)[0].name,
        };
      });
      this.dataEmployees = data;
      this.dataSource = new MatTableDataSource<PeriodicElement>(data);
      this.dataSource.paginator = this.paginator;
      return data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async delete(d: Employees){
    if (confirm(`Anda yakin ingin menghapus ${d.name}?`)){
      await this.service.deleteData(d.id);
      this._snackBar.open(`Berhasil menghapus ${d.name}`, 'OK', {
        duration: 3500,
      });
      await this.service.getData().then((res: any) => {
        const data = res.map((t: Employees) => {
          return {
            ...t,
            position: this.positionList.filter(a => a.id === t.positionId)[0].name,
            division: this.divisionList.filter(a => a.id === t.divisionId)[0].name,
          };
        });
        this.dataEmployees = data;
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        this.dataSource.paginator = this.paginator;
        return data;
      });
    }
  }

}
