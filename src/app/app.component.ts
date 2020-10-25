import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

import { GridOptions } from 'ag-grid-community/main';
import { HeaderComponent } from './header-component/header.component';
import { HeaderGroupComponent } from './header-group-component/header-group.component';

// En tsconfig.json hay que añadir:
// "resolveJsonModule": true,
// "allowSyntheticDefaultImports": true
import localeTextESPes from '../assets/localeTextESPes.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  // title = 'app';
  private gridApi;
  private gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public gridOptions: GridOptions;
  public localeText;
  public sideBar;
  public rowData: any;
  public defaultSortModel;
  public rowGroupPanelShow;
  public statusBar;
  public paginationPageSize;
  public autoGroupColumnDef;

  public groupHeaderHeight = 25;
  public headerHeight = 75;
  private HeaderNumericWidth = 100;
  public isExpanded = false;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {headerName: 'Programa-Capítulo-Económico.',
        children: [
          {
            headerName: 'Programa',
            width: 500,
            pinned: 'left',
            showRowGroup: 'DesPro',
            cellRenderer: 'agGroupCellRenderer',
            filter: false,
            cellRendererParams: {
              suppressCount: true,
              footerValueGetter(params) {
                switch (params.node.level) {
                  case 0:  // Total programa.
                    return '<span style="color: red; font-size: 14px; font-weight: bold; margin-left: 0px;"> Total ' + params.value + '</span>';
                  case -1: // Total general.
                    return '<span style="color: red; font-size: 18px; font-weight: bold; margin-right: 0px;"> Total general' + '</span>';
                  default:
                    return 'SIN FORMATO';
                }
              }
            }
          },
          // Si no tengo esta parte separada no funciona bien, repite Programa con cada Económico.
          {
            field: 'DesPro',
            rowGroup: true,
            hide: true,
            pinned: 'left'
          },
          {
            headerName: '',
            field: 'CodCap',
            width: 10,
            hide: true,
            pinned: 'left',
            filter: false
          },
          {
            headerName: 'Capítulo',
            field: 'DesCap',
            width: 300,
            rowGroup: true,
            filter: false,
            pinned: 'left',
            showRowGroup: 'DesCap',
            cellRenderer: 'agGroupCellRenderer',
            valueGetter: params => {
              if (params.data) {
                return params.data.CodCap + ' - ' + params.data.DesCap;
              } else {
                return null;
              }
            },
            cellRendererParams: {
              suppressCount: true,
              innerRenderer: params => {
                // console.log('params', params);
                if (params.node.group) {
                  return params.value;
                } else {
                  return '';
                }
              },
              footerValueGetter(params) {
                const val = params.value.split(' - ')[1];
                switch (params.node.level) {
                  case 1:  // Total capítulo.
                    return '<span style="color: red; font-size: 12px;  font-weight: bold; margin-left: 0px;"> Total ' + val + '</span>';
                  case -1: // Total general.
                    return '';
                  default:
                    return 'SIN FORMATO';
                }
              }
            }
          },
          {
            headerName: '',
            field: 'Eco',
            width: 57,
            pinned: 'left',
            filter: false,
          },
          {
            headerName: 'Económico',
            field: 'DesEco',
            cellClass: 'resaltado',
            width: 400,
            pinned: 'left',
            filter: false,
          },
        ]
      },


          {
            // para separar el headerName en 3 lineas debe contener DOS comas.
            headerName: 'Creditos,,',
            headerComponentFramework: HeaderComponent,
            field: 'CréditosIniciales',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
                    },
   ];

    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true
    };

    this.sideBar = {
      toolPanels: ['filters', 'columns']
    };

    // this.rowGroupPanelShow = 'always';
    // this.statusBar = {
    //   statusPanels: [
    //     {
    //       statusPanel: 'agTotalAndFilteredRowCountComponent',
    //       align: 'left'
    //     },
    //     { statusPanel: 'agAggregationComponent' }
    //   ]
    // };
    // this.paginationPageSize = 500;

    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = {} as GridOptions;
    this.gridOptions.defaultColDef = {
      headerComponentFramework: HeaderComponent as new () => HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };

    this.defaultSortModel = [
      {
        colId: 'CodEco',
        sort: 'asc'
      }
    ];

    this.localeText = localeTextESPes;
    }

  ngOnInit() { }

  onGridReady(params) {
    this.gridApi = params.api;
    // console.log( this.gridApi );
    this.gridColumnApi = params.columnApi;
    this.rowData = this.http.get('https://mamjerez.fra1.digitaloceanspaces.com/2020PreGas.json');
    params.api.setSortModel(this.defaultSortModel);
  }

  expandAll() {
    this.gridApi.expandAll();
    this.isExpanded = true;
  }

  collapseAll() {
    this.gridApi.collapseAll();
    this.isExpanded = false;
  }

}

function CellRendererOCM(params: any) {
  if (params.value) {
    const valorFormateado = params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    if (params.node.footer) {
      switch (params.node.level) {
        case 1: // Total capítulo.
          return '<p style="text-align: right; color: red; font-size: 12px; font-weight: bold">' + valorFormateado + '</p>';
        case 0:  // Total programa.
          return '<p style="text-align: right; color: red; font-size: 13px; font-weight: bold">' + valorFormateado + '</p>';
        case -1: // Total general.
          return '<p style="text-align: right; color: red; font-size: 14px; font-weight: bold">' + valorFormateado + '</p>';
        default:
          return 'SIN FORMATO';
      }
    } else {
      return '<p style="text-align: right">' + valorFormateado + '</p>';
    }
  } else {
    return '';
  }
}




// {
    //   headerName: '',
    //   field: 'Cod Pro',
    //   width: 57,
    //   cellStyle: cellStyleRight,
    //   hide: true
    // },

 //  TODO: NO parece hacer nada.
  // autoGroupColumnDef = {
  //   headerName: 'Programa',
  //   field: 'Programa',
  //   cellRenderer: 'agGroupCellRenderer',
  //   cellRendererParams: {
  //     checkbox: true
  //   }
  // };

// function CurrencyCellRenderer(params: any) {
//   const inrFormat = new Intl.NumberFormat('es-ES', {
//     style: 'decimal',
//     currency: 'EUR',
//     minimumFractionDigits: 0
//   });
//   console.log(inrFormat.format(params.value));
//   return inrFormat.format(params.value);
// }
