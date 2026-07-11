import { Component, type ReactNode } from 'react';
import { View } from 'react-native';
import { ErrorState } from './ui/States';

interface Props {
  children: ReactNode;
  /** Optional label to aid debugging in logs. */
  name?: string;
}

interface State {
  hasError: boolean;
}

/**
 * A reusable error boundary for wrapping screen content. Unlike the root
 * expo-router boundary, this can be placed around individual, riskier subtrees
 * so a failure in one area does not blank the whole app.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(`[AppErrorBoundary${this.props.name ? `:${this.props.name}` : ''}]`, error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1 }}>
          <ErrorState
            title="This section couldn't load"
            message="An unexpected error occurred. You can try again."
            onAction={this.reset}
          />
        </View>
      );
    }
    return this.props.children;
  }
}
