import { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

export class CustomLoadingOverlay implements ICellRendererComp {
  eGui!: HTMLElement;

  init(params: ICellRendererParams & { onCancel: () => {} }) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML =
      `<div class="box">
        <div class="title is-5"><i class="fas fa-spinner"></i> <span class="">Executing</span></div>
        <div><button class="button is-small is-light">Cancel</button></div>
      </div>`;
    const button = this.eGui.querySelector('button');
    button?.addEventListener('click', params.onCancel)
  }

  getGui() {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
