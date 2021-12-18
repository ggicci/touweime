interface FieldError {
  resource: string
  field: string
  code: string
}

export interface ValidationErrorResponse {
  message: string
  errors: FieldError[]
}

export class ValidationError extends Error {
  fieldErrors: FieldError[]

  constructor(resp?: ValidationErrorResponse) {
    super(resp?.message)
    this.fieldErrors = resp?.errors ?? []
  }

  getFieldError(field: string): FieldError | undefined {
    return this.fieldErrors.find((error) => error.field === field)
  }
}
