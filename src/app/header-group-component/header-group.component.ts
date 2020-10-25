import { Component } from '@angular/core';
import { IHeaderGroupParams } from 'ag-grid-community/main';
import { IHeaderGroupAngularComp } from 'ag-grid-angular/main';

@Component({
    templateUrl: 'header-group.component.html',
    styleUrls: ['header-group.component.css']
})
export class HeaderGroupComponent implements IHeaderGroupAngularComp {
    public params: IHeaderGroupParams;
    public expanded: boolean;
    private groupNames;
    private gridColumnApi;
    private gridApi;

    agInit(params: IHeaderGroupParams): void {
        this.params = params;
        this.params.columnGroup.getOriginalColumnGroup().addEventListener('expandedChanged', this.onExpandChanged.bind(this));
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // console.log(this.gridColumnApi);
    }

    // onGridReady(params) {
    //   this.gridApi = params.api;
    //   this.gridColumnApi = params.columnApi;
    //   console.log(this.gridColumnApi);
    //  }

    ngOnDestroy() {
        // console.log(`Destroying HeaderComponent`);
    }

    expandOrCollapse() {
       console.log(this.params);
       this.params.setExpanded(!this.expanded);
    }

      // https://www.ag-grid.com/javascript-grid-grouping-headers/
    expandOrCollapseAll() {
      this.params.setExpanded(!this.expanded);
    }

    onExpandChanged() {
        this.expanded = this.params.columnGroup.getOriginalColumnGroup().isExpanded();
    }




}
