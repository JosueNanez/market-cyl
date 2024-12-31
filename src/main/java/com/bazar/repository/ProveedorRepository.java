package com.bazar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bazar.entity.Proveedor;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, String>{

}