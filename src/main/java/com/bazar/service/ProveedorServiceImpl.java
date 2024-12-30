package com.bazar.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bazar.entity.Proveedor;
import com.bazar.repository.ProveedorRepository;

@Service
public class ProveedorServiceImpl implements ProveedorService {

	@Autowired
	private ProveedorRepository repositorio;
	
	
	@Override
	public List<Proveedor> listarProveedores() {
		return repositorio.findAll();
	}

}
