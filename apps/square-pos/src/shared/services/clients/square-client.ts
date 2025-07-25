import { SquareClient, SquareEnvironment } from 'square'

let _squareClient: SquareClient | null = null
let _currentToken: string | undefined = undefined

export function getSquareClient(token: string) {
  if (!_squareClient || (_currentToken && _currentToken !== token)) {
    _squareClient = new SquareClient({
      token: token,
      environment:
        process.env.SQUARE_ENVIRONMENT === 'production'
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    })
    _currentToken = token
  }

  return _squareClient
}