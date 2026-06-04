import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Unknown error' }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface gap-4">
          <p className="text-sm font-semibold text-dark/60">Something went wrong.</p>
          <p className="text-xs text-dark/40 max-w-xs text-center">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="px-4 py-2 rounded-full bg-sky text-white text-xs font-semibold"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
