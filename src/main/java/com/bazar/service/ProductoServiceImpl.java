package com.bazar.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bazar.entity.DetalleProducto;
import com.bazar.entity.Producto;
import com.bazar.entity.ProductoDTO;
import com.bazar.repository.DetalleProductoRepository;
import com.bazar.repository.ProductoProcedureRepository;
import com.bazar.repository.ProductoRepository;

import jakarta.transaction.Transactional;

@Service
public class ProductoServiceImpl implements ProductoService {

	@Autowired
	private ProductoRepository productoRepository;

	@Autowired
	private DetalleProductoRepository detalleRepository;

	@Autowired
	private ProductoProcedureRepository procedureRepository;

	@Override
	public List<Producto> listaDeProductos() {
		return productoRepository.findAll();
	}

	@Override
	public List<DetalleProducto> listaProductosPorCategoria(String nomcateg) {
		List<DetalleProducto> listado = detalleRepository.findByNomcateg(nomcateg);
		return listado;
	}

	@Override
	public Producto productoPorCodigo(String codpro) {
		return productoRepository.findById(codpro).get();
	}

	@Override
	public List<Producto> listaAccesosDirectos() {
		List<Producto> listado = productoRepository.findByAccrapido(1);
		return listado;
	}

	@Override
	public ProductoDTO registraActualizaProducto(ProductoDTO dto) {
		procedureRepository.crearActualizarProducto(dto.getCodpro(), dto.getNomprod(), dto.getFecvenc(),
				dto.getNomprov(), dto.getPreccompra(), dto.getPrecventa(), dto.getNomcateg(), dto.getStockminimo(),
				dto.getStockcodigo());
		return dto;
	}

	@Override
	public void eliminarProducto(String nomprod) {
		procedureRepository.eliminarProducto(nomprod);
	}

	@Override
	public List<DetalleProducto> SPBusquedaDimanProducto(String nomprod) {
		List<DetalleProducto> resultados = detalleRepository.busquedaDinamicaProd(nomprod);
		return resultados != null ? resultados : new ArrayList<>();
	}

	@Override
	public List<Producto> BusquedaDimanProductoMante(String nomprod) {
		List<Producto> resultados = productoRepository.busquedaDinamicaProdMant(nomprod);
		return resultados != null ? resultados : new ArrayList<>();
	}

	@Override
	public Producto actualizarAccRapido(String nomprod, int accrapido) {
		Producto producto = productoRepository.findByNomprod(nomprod);
		producto.setAccrapido(accrapido);
		productoRepository.save(producto);
		return producto;
	}

	@Transactional
	public void eliminarProductoPorCodigo(String codpro) {
		Producto producto = productoRepository.findById(codpro)
				.orElseThrow(() -> new RuntimeException("Producto no encontrado con código: " + codpro));
		// productoRepository.flush();
		productoRepository.delete(producto);
	}

	@Override
	public DetalleProducto detalleProductoNombre(String nomprod) {
		return detalleRepository.findByNomprod(nomprod);
	}

	@Transactional
	public DetalleProducto actualizarDetalleProducto(String nomprod, DetalleProducto detalleproducto) {
		Optional<DetalleProducto> productoExistente = detalleRepository.findById(nomprod);

		if (productoExistente.isPresent()) {
			DetalleProducto producto = productoExistente.get();
			producto.setPreccompra(detalleproducto.getPreccompra());
			producto.setPrecventa(detalleproducto.getPrecventa());
			producto.setNomcateg(detalleproducto.getNomcateg());
			producto.setStockminimo(detalleproducto.getStockminimo());
			producto.setStockactual(detalleproducto.getStockactual());
			producto.setStockFaltanteRepo(detalleproducto.getStockFaltanteRepo());

			return detalleRepository.save(producto);
		} else {
			throw new RuntimeException("Producto no encontrado con NOM_PRO: " + nomprod);
		}
	}

	@Override
	public void actualizarPrecios(String nomprod, BigDecimal preccompra, BigDecimal precventa) {
		int filasActualizadas = detalleRepository.actualizarPreciosPorNombre(nomprod, preccompra, precventa);
		if (filasActualizadas == 0) {
			throw new RuntimeException("Producto no encontrado o no se pudo actualizar.");
		}
	}

	@Override
	public List<Producto> obtenerProductosPorCategoria(String nomcateg) {
		return productoRepository.findProductosByNomCateg(nomcateg);
	}

}
