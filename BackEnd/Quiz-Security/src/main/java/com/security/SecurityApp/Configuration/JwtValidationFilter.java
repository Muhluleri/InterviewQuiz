package com.security.SecurityApp.Configuration;

import com.security.SecurityApp.Service.jwt.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class JwtValidationFilter extends OncePerRequestFilter {

  private final JWTService jwtService;
  private final UserDetailsService userDetailsService ;
  private final HandlerExceptionResolver handlerExceptionResolver ;


  @Override
  protected void doFilterInternal(@NonNull  HttpServletRequest request,
                                  @NonNull HttpServletResponse response,
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");

    if (Objects.isNull(authHeader) || !authHeader.startsWith("Bearer "))
    {
      filterChain.doFilter(request , response);
      return;
    }

    try {
      final String jwt = getJwt(request) ;
      final String userEmail = jwtService.extractUsername(jwt);

      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

      if( Objects.nonNull(userEmail) && Objects.isNull(authentication)){
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

        if (jwtService.isTokenValid(jwt , userDetails)){
          UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDetails ,
                                                                                    null ,
                                                                                              userDetails.getAuthorities());

          token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(token);
        }
      }
      filterChain.doFilter(request, response);
    } catch (Exception e) {
      handlerExceptionResolver.resolveException(request , response , null , e);
    }


  }

  private String getJwt(HttpServletRequest request) {

    String jwt = request.getHeader("authorization");

    if (Objects.nonNull(jwt) && jwt.startsWith("Bearer")) {
      if (jwt.length() > 7) {
        jwt.substring(7);
      }
    }
    return null;
  }
}
