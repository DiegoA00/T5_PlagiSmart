package com.anecacao.api.reporting.domain.exception;

import com.anecacao.api.request.creation.data.entity.Status;

public class InvalidFumigationStatusException extends RuntimeException {
    public InvalidFumigationStatusException(Long id, Status status) {
        super ("Fumigation with ID " + id + " cannot be reported because it is not in an " + status + " or failed state.");
    }
}
