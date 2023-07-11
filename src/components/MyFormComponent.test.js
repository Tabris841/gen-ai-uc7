import { render, fireEvent, screen } from '@testing-library/react';

import MyFormComponent from './MyFormComponent';

describe('MyFormComponent', () => {
  let consoleSpy;

  const fillForm = ({
    name = null,
    email = null,
    agreeTerms = null,
    gender = null,
  }) => {
    if (name !== null) {
      fireEvent.change(screen.getByPlaceholderText('Name'), {
        target: { value: name },
      });
    }

    if (email !== null) {
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: email },
      });
    }

    if (agreeTerms !== null) {
      fireEvent.click(screen.getByTestId('agree-terms'));
    }

    if (gender !== null) {
      fireEvent.click(screen.getByTestId(`gender-${gender}`));
    }

    fireEvent.click(screen.getByText('Submit'));
  };

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('submits the form with all fields filled in correctly', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'John Doe',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'female',
    };

    fillForm(formValues);

    expect(consoleSpy).toHaveBeenCalledWith(formValues);
  });

  test('handles a very long valid name', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'This is a very long name that exceeds the character limit',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'male',
    };

    fillForm(formValues);

    expect(consoleSpy).toHaveBeenCalledWith(formValues);
  });

  test('handles a complex valid email address', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'John Doe',
      email: 'test.name+alias@example.co.uk',
      agreeTerms: true,
      gender: 'female',
    };

    fillForm(formValues);

    expect(consoleSpy).toHaveBeenCalledWith(formValues);
  });

  test('changes gender and submits the form', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'John Doe',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'male',
    };

    fillForm(formValues);

    fireEvent.click(screen.getByTestId('gender-female'));

    expect(consoleSpy).toHaveBeenCalledWith(formValues);
  });

  test('re-submits the form after initial successful submission', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'John Doe',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'male',
    };

    fillForm(formValues);

    expect(consoleSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'male',
    });

    fireEvent.click(screen.getByText('Submit'));

    expect(console.log).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'male',
    });
  });

  test('submits the form with the "Name" field left blank', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: '',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'female',
    };

    fillForm(formValues);

    expect(
      screen.getByText('Name must be at least 3 characters.')
    ).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(formValues);
  });

  test('submits the form with an invalid email address', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'John Doe',
      email: 'invalid-email',
      agreeTerms: true,
      gender: 'female',
    };

    fillForm(formValues);

    expect(screen.getByText('Email must be valid.')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(formValues);
  });

  test('displays error message when "Agree to Terms" checkbox is not checked', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'John Doe',
      email: 'test@example.com',
      gender: 'female',
    };

    fillForm(formValues);

    expect(
      screen.getByText('You must agree to the terms.')
    ).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith({
      ...formValues,
      agreeTerms: false,
    });
  });

  test('displays error message when gender is not selected', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'John Doe',
      email: 'test@example.com',
      agreeTerms: true,
    };

    fillForm(formValues);

    expect(screen.getByText('You must select a gender.')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith({
      ...formValues,
      gender: '',
    });
  });

  test('displays error message when name is less than 3 characters long', () => {
    render(<MyFormComponent />);

    const formValues = {
      name: 'Jo',
      email: 'test@example.com',
      agreeTerms: true,
      gender: 'female',
    };

    fillForm(formValues);

    expect(
      screen.getByText('Name must be at least 3 characters.')
    ).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(formValues);
  });
});
