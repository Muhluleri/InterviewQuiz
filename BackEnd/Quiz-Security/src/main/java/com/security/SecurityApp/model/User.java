package com.security.SecurityApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Table(name = "users")
@Entity
@Getter
@Setter
public class User implements UserDetails {


  @Id
  @SequenceGenerator(name = "used_id" , sequenceName = "user_id_gen")
  @GeneratedValue(generator = "user_id_gen")
  private long id ;

  @Column(nullable = false)
  private String username ;

  @Column(unique = true  , nullable = false)
  private String email ;

  @Column(nullable = false)
  private String password ;

  @Column(nullable = false)
  private String fullName;

  @CreationTimestamp
  @Column(updatable = false )
  private LocalDateTime createdAt ;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }
}
