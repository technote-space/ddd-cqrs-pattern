import IndexPageProps from './server';

describe('IndexPageProps', () => {
  describe('getStaticProps', () => {
    it('should return props', async () => {
      const props = await (new IndexPageProps()).getStaticProps();

      expect(props).toHaveProperty('props');
      expect(props).toHaveProperty('revalidate');
    });
  });
});
