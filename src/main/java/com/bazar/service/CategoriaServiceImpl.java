package com.bazar.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bazar.entity.Categoria;
import com.bazar.repository.CategoriaRepository;

@Service
public class CategoriaServiceImpl implements CategoriaService{

	@Autowired
	private CategoriaRepository repositorio;
	
	
	@Override
	public List<Categoria> listarCategorias() {
	    List<Categoria> categorias = repositorio.findAll();
	    System.out.println("Categorías recuperadasServ: " + categorias);
	    return categorias;
	}

}
