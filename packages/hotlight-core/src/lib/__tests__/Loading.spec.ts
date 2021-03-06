import { render, fireEvent, getByTestId } from '@testing-library/svelte';
import Loading from '../Loading.svelte';

describe('Loading', () => {
  it('is visible', async () => {
    const { queryByTestId } = render(Loading);
    const element = queryByTestId("loading-indicator");
    expect(element).not.toBeNull();
  });
});