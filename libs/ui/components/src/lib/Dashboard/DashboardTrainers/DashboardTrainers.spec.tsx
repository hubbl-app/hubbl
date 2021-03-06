import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardTrainers from './DashboardTrainers';

describe('<DashboardTrainers />', () => {
  const items = [
    {
      id: 1,
      firstName: 'NameOne',
      lastName: 'Description'
    },
    {
      id: 2,
      firstName: 'NameTwo',
      lastName: 'Description'
    },
    {
      id: 3,
      firstName: 'NameThree',
      lastName: 'Description'
    }
  ];

  it('should render properly', () => {
    const { container } = render(<DashboardTrainers items={items as any} />);

    expect(container).toBeInTheDocument();
  });

  describe('items', () => {
    it('should render the three gym zones and the button', () => {
      render(<DashboardTrainers items={items as any} />);

      items.forEach(({ firstName, lastName }) => {
        expect(
          screen.getByText(`${firstName} ${lastName}`)
        ).toBeInTheDocument();
      });
    });

    it('should only render 5 items', () => {
      render(
        <DashboardTrainers
          items={
            // Override the id to avoid ESLint error log
            [...items, ...items].map((item, i) => ({ ...item, id: i })) as any
          }
        />
      );

      expect(
        screen.getAllByText(`${items[0].firstName} ${items[0].lastName}`).length
      ).toBe(2);
      expect(
        screen.getAllByText(`${items[1].firstName} ${items[1].lastName}`).length
      ).toBe(2);
      expect(
        screen.getAllByText(`${items[2].firstName} ${items[2].lastName}`).length
      ).toBe(1);
    });
  });

  describe('onAddClick', () => {
    it('should call onAddTrainer if placeholder clicked', async () => {
      const onAddSpy = jest.fn();

      render(
        <DashboardTrainers items={items as any} onAddTrainer={onAddSpy} />
      );
      await userEvent.click(screen.getByText('Click me to create a new trainer!'));

      expect(onAddSpy).toHaveBeenCalledTimes(1);
    });
  });
});
