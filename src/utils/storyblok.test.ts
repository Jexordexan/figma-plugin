import fetchChangelog, { formatDate } from './storyblok';
import { mockFetch } from '../../tests/__mocks__/fetchMock';

describe('fetchChangelog', () => {
  it('called correct api', async () => {
    const mockLastOnline = new Date();
    const mockSetChangelog = jest.fn();

    await fetchChangelog(mockLastOnline, mockSetChangelog);
    expect(mockFetch).toBeCalledWith(
      `https://api.storyblok.com/v1/cdn/stories?version=published&token=${process.env.STORYBLOK_ACCESS_TOKEN}&first_published_at_gt=${formatDate(mockLastOnline)}&startsWith=changelog/&sort_by=first_published_at`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
});
