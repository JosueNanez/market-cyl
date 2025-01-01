package com.bazar.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import com.bazar.entity.DetalleProducto;
import com.bazar.entity.Producto;
import com.bazar.service.CategoriaService;
import com.bazar.service.ProductoService;

@Controller
@RequestMapping("/venta")
public class VentaController {
	
	@Autowired
	private CategoriaService servicioCategoria;
	
	@Autowired
	private ProductoService servicioProducto;
	
	/*
	@Autowired
	private ProveedorService proveedorservice;
	
	@GetMapping("/cargar")
	public String listarProveedores(Model proveed) {
		proveed.addAttribute("proveedores", proveedorservice.listarProveedores());
		return "mantenimiento_listaProveedores";
	}*/
	

	@GetMapping("/lista")
	public String listarCategorias(Model modelo, Model modPro) {
		modelo.addAttribute("categorias", servicioCategoria.listarCategorias());
		modPro.addAttribute("productos", servicioProducto.listaProductosPorCategoria("EMBUTIDOS"));
		return "index";
	}
	
	
	//ENDPOINTS
	@GetMapping("/lista/apiProdCategoria")
	@ResponseBody
	public List<DetalleProducto> obtenerProdCategoria(@RequestParam() String categor){
		return servicioProducto.listaProductosPorCategoria(categor);
	}
	
	@GetMapping("/ProductoPorCodigo")
	@ResponseBody
	public Producto obtenerporCodigo(@RequestParam() String codigo) {
		Producto producto = servicioProducto.productoPorCodigo(codigo);
		if (producto == null) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Producto no registrado"); 
		}
		return producto;
	}
	
	
	@GetMapping("/busquedaDinamica")
	@ResponseBody
	public List<DetalleProducto> obtenerSugerencias(@RequestParam() String param) {
		return servicioProducto.SPBusquedaDimanProducto(param);
	}
	
	@GetMapping("/accesosDirectos")
	@ResponseBody
	public List<Producto> obtenerAccesosDir() {
		return servicioProducto.listaAccesosDirectos();
	}
	
	//ACCESOS DIRECTOS
	@GetMapping("/updateAcceso")
	@ResponseBody
	public Producto actualizarAcceso(@RequestParam() String nomProd, @RequestParam() int acceso) {
		return servicioProducto.actualizarAccRapido(nomProd, acceso);
	}

	

}
