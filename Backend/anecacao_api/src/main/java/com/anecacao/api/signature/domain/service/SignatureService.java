package com.anecacao.api.signature.domain.service;

import com.anecacao.api.signature.data.dto.SignatureResponse;
import com.anecacao.api.signature.data.dto.SignatureUploadRequest;

import java.io.IOException;

public interface SignatureService {
    SignatureResponse saveSignature (SignatureUploadRequest request) throws IOException;
}
