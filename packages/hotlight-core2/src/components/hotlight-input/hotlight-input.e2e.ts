import { newE2EPage } from '@stencil/core/testing';

describe('hotlight-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<hotlight-input></hotlight-input>');
    const element = await page.find('hotlight-input');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<hotlight-input></hotligth-input>');
    const component = await page.find('hotligth-input');
    const element = await page.find('hotligth-input >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
