package models

type BusinessError struct {
	Code ErrorCode
}

func NewBusinessError(code ErrorCode) *BusinessError {
	return &BusinessError{Code: code}
}

func NoError() *BusinessError {
	return &BusinessError{Code: ErrorCode_NO_ERROR}
}

func (e *BusinessError) Error() string {
	return GetErrorMessage(e.Code)
}

func GetErrorMessage(errorCode ErrorCode) string {
	switch errorCode {
	case ErrorCode_NO_ERROR:
		return "Request succeeded."
	case ErrorCode_UNKNOWN_ERROR:
		return "Unknown errors has occured."
	case ErrorCode_UNAUTHORIZED_USER:
		return "Unauthorized."
	default:
		return "Unknown errors has occured."
	}
}
