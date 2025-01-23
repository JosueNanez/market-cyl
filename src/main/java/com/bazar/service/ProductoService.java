package com.bazar.service;

import java.math.BigDecimal;
import java.util.List;

import com.bazar.entity.DetalleProducto;
import com.bazar.entity.Producto;
import com.bazar.entity.ProductoDTO;

public interface ProductoService {
	
	public List<Producto> listaDeProductos();
	
	public List<DetalleProducto> listaProductosPorCategoria(String nomcateg);
	
	public Producto productoPorCodigo(String codpro);
	
	public List<Producto> listaAccesosDirectos();
	
	public ProductoDTO registraActualizaProducto(ProductoDTO dto);
	
	public void eliminarProducto(String nomprod);
	
	public List<DetalleProducto> SPBusquedaDimanProducto(String nomprod);
	
	public List<Producto> BusquedaDimanProductoMante(String nomprod);
	
	public Producto actualizarAccRapido(String nomprod, int accrapido);

	public void eliminarProductoPorCodigo(String codpro);
	
	public DetalleProducto detalleProductoNombre(String nomprod);
	
	public DetalleProducto actualizarDetalleProducto(String nomprod, DetalleProducto detalleproducto);
	
	public void actualizarPrecios(String nomprod, BigDecimal preccompra, BigDecimal precventa);
	
	public List<Producto> obtenerProductosPorCategoria(String nomcateg);
	
	public boolean actualizaCodpro(String codproActual, String nuevoCodpro);
	
	public void actualizarNomprod(String antiguoNomprod, String nuevoNomprod);
	
	//public void actualizarCategoriaANuevo(String nomProd, String nuevaCateg);
}
