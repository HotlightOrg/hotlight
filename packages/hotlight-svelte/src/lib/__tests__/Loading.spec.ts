import { render, fireEvent } from '@testing-library/svelte';
import Loading from '../Loading.svelte';

describe('Loading', () => {
  it('it changes count when button is clicked', async () => {
    const { getByText } = render(Loading);
    const button = getByText(/Clicks:/);
    expect(button.innerHTML).toBe('Clicks: 0');
    await fireEvent.click(button);
    expect(button.innerHTML).toBe('Clicks: 1');
  });
});