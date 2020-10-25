import { Component, ElementRef } from '@angular/core';
import { IHeaderParams } from 'ag-grid-community';
import { IHeaderAngularComp } from 'ag-grid-angular/main';

interface MyParams extends IHeaderParams {
    menuIcon: string;
}

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements IHeaderAngularComp {
    public params: MyParams;
    public sorted: string;
    private elementRef: ElementRef;

    private myHeaderNameArray: any;
    public myHeaderNameLinea1: string;
    public myHeaderNameLinea2: string;
    public myHeaderNameLinea3: string;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    agInit(params: MyParams): void {
        this.params = params;
        this.params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
        this.onSortChanged();

        // Se recibe un string separado por comas, cada coma se convierte en una linea.
        this.myHeaderNameArray = this.params.displayName.slice(4, this.params.displayName.length - 1).split(',');
        this.myHeaderNameLinea1 =  this.myHeaderNameArray[0];
        this.myHeaderNameLinea2 =  this.myHeaderNameArray[1];
        this.myHeaderNameLinea3 =  this.myHeaderNameArray[2];
    }

    ngOnDestroy() {
        // console.log(`Destroying HeaderComponent`);
    }

    onMenuClick() {
        this.params.showColumnMenu(this.querySelector('.customHeaderMenuButton'));
    }

    onSortRequested(order, event) {
        this.params.setSort(order, event.shiftKey);
    }

    onSortChanged() {
        if (this.params.column.isSortAscending()) {
            this.sorted = 'asc';
        } else if (this.params.column.isSortDescending()) {
            this.sorted = 'desc';
        } else {
            this.sorted = '';
        }
    }

    private querySelector(selector: string) {
        return this.elementRef.nativeElement.querySelector(
            '.customHeaderMenuButton', selector) as HTMLElement;
    }
}
