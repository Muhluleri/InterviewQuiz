package com.security.SecurityApp.Service.verification.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Builder
public class VerificationResponse {
  private String username ;
  private String jwt ;
  private boolean required ;
  private boolean authValid ;
  private boolean tokenValid ;
  private String message ;
}
