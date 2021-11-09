import { Prop, Component, Host, h } from '@stencil/core';

@Component({
  tag: 'hotlight-crumb',
  styleUrl: 'hotlight-crumb.css',
  shadow: true,
})
export class HotlightCrumb {
  @Prop() label: string;

  render() {
    return (
      <Host>
        <button class="crumb">
          <span>{this.label}</span>
        </button>
        <slot></slot>
      </Host>
    );
  }
}
