--
-- PostgreSQL database dump
--

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 17.5

-- Started on 2025-11-02 13:42:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 978 (class 1247 OID 82008)
-- Name: enum_datos_ciclista_genero; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_datos_ciclista_genero AS ENUM (
    'masculino',
    'femenino',
    'otro',
    'prefiero_no_decir'
);


ALTER TYPE public.enum_datos_ciclista_genero OWNER TO postgres;

--
-- TOC entry 987 (class 1247 OID 82044)
-- Name: enum_datos_ciclista_nivel_experiencia; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_datos_ciclista_nivel_experiencia AS ENUM (
    'principiante',
    'intermedio',
    'avanzado',
    'experto'
);


ALTER TYPE public.enum_datos_ciclista_nivel_experiencia OWNER TO postgres;

--
-- TOC entry 981 (class 1247 OID 82018)
-- Name: enum_datos_ciclista_talla_playera; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_datos_ciclista_talla_playera AS ENUM (
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL'
);


ALTER TYPE public.enum_datos_ciclista_talla_playera OWNER TO postgres;

--
-- TOC entry 984 (class 1247 OID 82032)
-- Name: enum_datos_ciclista_tipo_bicicleta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_datos_ciclista_tipo_bicicleta AS ENUM (
    'ruta',
    'montaña',
    'urbana',
    'hibrida',
    'gravel'
);


ALTER TYPE public.enum_datos_ciclista_tipo_bicicleta OWNER TO postgres;

--
-- TOC entry 954 (class 1247 OID 41264)
-- Name: enum_eventos_estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_eventos_estado AS ENUM (
    'Próximo',
    'En Curso',
    'Finalizado',
    'Cancelado'
);


ALTER TYPE public.enum_eventos_estado OWNER TO postgres;

--
-- TOC entry 951 (class 1247 OID 41256)
-- Name: enum_usuarios_rol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_usuarios_rol AS ENUM (
    'usuario',
    'organizador',
    'admin'
);


ALTER TYPE public.enum_usuarios_rol OWNER TO postgres;

--
-- TOC entry 1041 (class 1247 OID 98922)
-- Name: estado_evento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_evento AS ENUM (
    'proximo',
    'en_curso',
    'finalizado',
    'cancelado'
);


ALTER TYPE public.estado_evento OWNER TO postgres;

--
-- TOC entry 1047 (class 1247 OID 98940)
-- Name: estado_inscripcion; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_inscripcion AS ENUM (
    'pendiente',
    'confirmada',
    'cancelada'
);


ALTER TYPE public.estado_inscripcion OWNER TO postgres;

--
-- TOC entry 1050 (class 1247 OID 98948)
-- Name: estado_pago; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_pago AS ENUM (
    'pendiente',
    'aprobado',
    'rechazado'
);


ALTER TYPE public.estado_pago OWNER TO postgres;

--
-- TOC entry 1053 (class 1247 OID 98956)
-- Name: estado_resultado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_resultado AS ENUM (
    'finalizo',
    'no_finalizo',
    'descalificado'
);


ALTER TYPE public.estado_resultado OWNER TO postgres;

--
-- TOC entry 1029 (class 1247 OID 98877)
-- Name: genero; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.genero AS ENUM (
    'masculino',
    'femenino',
    'otro',
    'prefiero_no_decir'
);


ALTER TYPE public.genero OWNER TO postgres;

--
-- TOC entry 1032 (class 1247 OID 98886)
-- Name: nivel_experiencia; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.nivel_experiencia AS ENUM (
    'principiante',
    'intermedio',
    'avanzado',
    'experto'
);


ALTER TYPE public.nivel_experiencia OWNER TO postgres;

--
-- TOC entry 1044 (class 1247 OID 98932)
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rol_usuario AS ENUM (
    'usuario',
    'organizador',
    'administrador'
);


ALTER TYPE public.rol_usuario OWNER TO postgres;

--
-- TOC entry 1035 (class 1247 OID 98896)
-- Name: talla_playera; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.talla_playera AS ENUM (
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL'
);


ALTER TYPE public.talla_playera OWNER TO postgres;

--
-- TOC entry 1038 (class 1247 OID 98910)
-- Name: tipo_bicicleta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_bicicleta AS ENUM (
    'ruta',
    'montaña',
    'urbana',
    'hibrida',
    'gravel'
);


ALTER TYPE public.tipo_bicicleta OWNER TO postgres;

--
-- TOC entry 294 (class 1255 OID 123132)
-- Name: actualizar_fecha_actualizacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_fecha_actualizacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_fecha_actualizacion() OWNER TO postgres;

--
-- TOC entry 295 (class 1255 OID 123135)
-- Name: calcular_dificultad_ruta(numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_dificultad_ruta(p_distancia_km numeric, p_elevacion_total numeric) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN CASE
        WHEN p_distancia_km <= 50 AND p_elevacion_total <= 500 THEN 'facil'
        WHEN p_distancia_km <= 100 AND p_elevacion_total <= 1000 THEN 'moderado'
        WHEN p_distancia_km <= 150 AND p_elevacion_total <= 2000 THEN 'dificil'
        ELSE 'extremo'
    END;
END;
$$;


ALTER FUNCTION public.calcular_dificultad_ruta(p_distancia_km numeric, p_elevacion_total numeric) OWNER TO postgres;

--
-- TOC entry 297 (class 1255 OID 123177)
-- Name: current_user_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.current_user_id() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Esto es un placeholder - debes implementar la lógica real según tu sistema de autenticación
    RETURN NULL; -- Reemplazar con la lógica real
END;
$$;


ALTER FUNCTION public.current_user_id() OWNER TO postgres;

--
-- TOC entry 296 (class 1255 OID 123136)
-- Name: generar_token_invitacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generar_token_invitacion() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    token VARCHAR(100);
BEGIN
    token := encode(gen_random_bytes(32), 'hex');
    RETURN token;
END;
$$;


ALTER FUNCTION public.generar_token_invitacion() OWNER TO postgres;

--
-- TOC entry 299 (class 1255 OID 123190)
-- Name: obtener_estadisticas_usuario(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_estadisticas_usuario(p_id_usuario integer) RETURNS TABLE(total_eventos bigint, eventos_confirmados bigint, km_totales numeric, equipos_pertenece bigint, logros_obtenidos bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(i.id_inscripcion)::BIGINT,
        COUNT(CASE WHEN i.estado = 'confirmada' THEN 1 END)::BIGINT,
        COALESCE(SUM(i.distancia_completada), 0)::NUMERIC,
        COUNT(DISTINCT me.id_equipo)::BIGINT,
        COUNT(DISTINCT lu.id_logro)::BIGINT
    FROM public.usuarios u
    LEFT JOIN public.inscripciones i ON u.id_usuario = i.id_usuario
    LEFT JOIN public.miembros_equipo me ON u.id_usuario = me.id_usuario
    LEFT JOIN public.logros_usuarios lu ON u.id_usuario = lu.id_usuario
    WHERE u.id_usuario = p_id_usuario
    GROUP BY u.id_usuario;
END;
$$;


ALTER FUNCTION public.obtener_estadisticas_usuario(p_id_usuario integer) OWNER TO postgres;

--
-- TOC entry 298 (class 1255 OID 123189)
-- Name: obtener_eventos_usuario(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_eventos_usuario(p_id_usuario integer) RETURNS TABLE(id_inscripcion integer, id_evento integer, evento character varying, fecha_inicio timestamp with time zone, ubicacion character varying, estado_inscripcion public.estado_inscripcion, estado_pago public.estado_pago)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id_inscripcion,
        e.id_evento,
        e.nombre::VARCHAR,
        e.fecha_inicio,
        e.ubicacion::VARCHAR,
        i.estado,
        p.estado
    FROM public.inscripciones i
    JOIN public.eventos e ON i.id_evento = e.id_evento
    LEFT JOIN public.pagos p ON i.id_inscripcion = p.id_inscripcion
    WHERE i.id_usuario = p_id_usuario
    ORDER BY e.fecha_inicio DESC;
END;
$$;


ALTER FUNCTION public.obtener_eventos_usuario(p_id_usuario integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 99014)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    edad_minima integer,
    edad_maxima integer,
    genero_permitido character varying(20),
    nivel character varying(50),
    activa boolean DEFAULT true,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 99025)
-- Name: categorias_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias_evento (
    id_categoria_evento integer NOT NULL,
    id_evento integer NOT NULL,
    id_categoria integer NOT NULL,
    cuota_categoria numeric(10,2),
    maximo_participantes integer,
    id_punto_control_final integer,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categorias_evento OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 99024)
-- Name: categorias_evento_id_categoria_evento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_evento_id_categoria_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_evento_id_categoria_evento_seq OWNER TO postgres;

--
-- TOC entry 3968 (class 0 OID 0)
-- Dependencies: 225
-- Name: categorias_evento_id_categoria_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_evento_id_categoria_evento_seq OWNED BY public.categorias_evento.id_categoria_evento;


--
-- TOC entry 223 (class 1259 OID 99013)
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_categoria_seq OWNER TO postgres;

--
-- TOC entry 3969 (class 0 OID 0)
-- Dependencies: 223
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- TOC entry 220 (class 1259 OID 98979)
-- Name: datos_ciclista; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.datos_ciclista (
    id_ciclista integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha_nacimiento timestamp with time zone,
    genero public.genero,
    contacto_emergencia character varying(100),
    telefono_emergencia character varying(20),
    talla_playera public.talla_playera,
    tipo_bicicleta public.tipo_bicicleta,
    nivel_experiencia public.nivel_experiencia,
    alergias text,
    condiciones_medicas text,
    direccion character varying(255),
    ciudad character varying(100),
    pais character varying(100),
    codigo_postal character varying(20),
    marca_bicicleta character varying(50),
    modelo_bicicleta character varying(50),
    ano_bicicleta integer,
    talla_bicicleta character varying(20),
    fecha_actualizacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.datos_ciclista OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 98978)
-- Name: datos_ciclista_id_ciclista_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.datos_ciclista_id_ciclista_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.datos_ciclista_id_ciclista_seq OWNER TO postgres;

--
-- TOC entry 3970 (class 0 OID 0)
-- Dependencies: 219
-- Name: datos_ciclista_id_ciclista_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.datos_ciclista_id_ciclista_seq OWNED BY public.datos_ciclista.id_ciclista;


--
-- TOC entry 228 (class 1259 OID 99045)
-- Name: equipos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipos (
    id_equipo integer NOT NULL,
    nombre character varying(100) NOT NULL,
    id_capitan integer NOT NULL,
    descripcion text,
    url_imagen text,
    enlace_invitacion character varying(255),
    activo boolean DEFAULT true,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.equipos OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 99044)
-- Name: equipos_id_equipo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipos_id_equipo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipos_id_equipo_seq OWNER TO postgres;

--
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 227
-- Name: equipos_id_equipo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipos_id_equipo_seq OWNED BY public.equipos.id_equipo;


--
-- TOC entry 222 (class 1259 OID 98996)
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id_evento integer NOT NULL,
    id_organizador integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    fecha_inicio timestamp with time zone NOT NULL,
    fecha_fin timestamp with time zone,
    fecha_limite_inscripcion timestamp with time zone,
    estado public.estado_evento DEFAULT 'proximo'::public.estado_evento NOT NULL,
    tipo character varying(50),
    ubicacion character varying(200),
    distancia_km numeric(6,2),
    elevacion_total numeric(8,2),
    dificultad character varying(20),
    cuota_inscripcion numeric(10,2) DEFAULT 0.00 NOT NULL,
    maximo_participantes integer,
    maximo_miembros_equipo integer,
    permite_union_equipos boolean DEFAULT true,
    url_imagen text,
    coordenadas_ruta jsonb,
    sectores_ruta jsonb,
    instrucciones_especiales text,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id_plantilla integer,
    configuracion_ruta jsonb,
    plantilla_personalizada boolean DEFAULT false,
    datos_meteorologicos jsonb,
    es_destacado boolean DEFAULT false,
    CONSTRAINT eventos_fechas_validas CHECK ((fecha_inicio < fecha_fin))
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 98995)
-- Name: eventos_id_evento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_evento_seq OWNER TO postgres;

--
-- TOC entry 3972 (class 0 OID 0)
-- Dependencies: 221
-- Name: eventos_id_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_evento_seq OWNED BY public.eventos.id_evento;


--
-- TOC entry 235 (class 1259 OID 99104)
-- Name: inscripciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscripciones (
    id_inscripcion integer NOT NULL,
    id_usuario integer NOT NULL,
    id_evento integer NOT NULL,
    id_categoria integer NOT NULL,
    id_talla_playera integer NOT NULL,
    id_equipo integer,
    numero_dorsal integer NOT NULL,
    alias_dorsal character varying(3) NOT NULL,
    estado public.estado_inscripcion DEFAULT 'pendiente'::public.estado_inscripcion,
    numero_telefono character varying(20),
    fecha_nacimiento date,
    genero character varying(50),
    nombre_contacto_emergencia character varying(100),
    telefono_contacto_emergencia character varying(20),
    url_identificacion text,
    tiempo_total interval,
    posicion_general integer,
    posicion_categoria integer,
    distancia_completada numeric(8,2),
    ritmo_promedio numeric(6,2),
    fecha_inscripcion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    datos_seguimiento jsonb,
    ultima_actualizacion_gps timestamp with time zone,
    modo_emergencia_activado boolean DEFAULT false
);


ALTER TABLE public.inscripciones OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 99103)
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscripciones_id_inscripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscripciones_id_inscripcion_seq OWNER TO postgres;

--
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 234
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscripciones_id_inscripcion_seq OWNED BY public.inscripciones.id_inscripcion;


--
-- TOC entry 263 (class 1259 OID 123018)
-- Name: integraciones_dispositivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.integraciones_dispositivos (
    id_integracion integer NOT NULL,
    id_usuario integer NOT NULL,
    plataforma character varying(50) NOT NULL,
    token_acceso text,
    token_actualizacion text,
    configuracion jsonb,
    activo boolean DEFAULT true,
    fecha_conexion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT integraciones_dispositivos_plataforma_check CHECK (((plataforma)::text = ANY ((ARRAY['strava'::character varying, 'garmin'::character varying, 'wahoo'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.integraciones_dispositivos OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 123017)
-- Name: integraciones_dispositivos_id_integracion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.integraciones_dispositivos_id_integracion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.integraciones_dispositivos_id_integracion_seq OWNER TO postgres;

--
-- TOC entry 3974 (class 0 OID 0)
-- Dependencies: 262
-- Name: integraciones_dispositivos_id_integracion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.integraciones_dispositivos_id_integracion_seq OWNED BY public.integraciones_dispositivos.id_integracion;


--
-- TOC entry 257 (class 1259 OID 122968)
-- Name: invitaciones_amigos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invitaciones_amigos (
    id_invitacion integer NOT NULL,
    id_usuario_invitador integer NOT NULL,
    email_invitado character varying(100) NOT NULL,
    token_invitacion character varying(100) NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    fecha_invitacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_aceptacion timestamp with time zone,
    recompensa_otorgada boolean DEFAULT false,
    CONSTRAINT invitaciones_amigos_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aceptada'::character varying, 'rechazada'::character varying])::text[])))
);


ALTER TABLE public.invitaciones_amigos OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 122967)
-- Name: invitaciones_amigos_id_invitacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invitaciones_amigos_id_invitacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invitaciones_amigos_id_invitacion_seq OWNER TO postgres;

--
-- TOC entry 3975 (class 0 OID 0)
-- Dependencies: 256
-- Name: invitaciones_amigos_id_invitacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitaciones_amigos_id_invitacion_seq OWNED BY public.invitaciones_amigos.id_invitacion;


--
-- TOC entry 271 (class 1259 OID 123087)
-- Name: items_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items_pedido (
    id_item integer NOT NULL,
    id_pedido integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL
);


ALTER TABLE public.items_pedido OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 123086)
-- Name: items_pedido_id_item_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_pedido_id_item_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_pedido_id_item_seq OWNER TO postgres;

--
-- TOC entry 3976 (class 0 OID 0)
-- Dependencies: 270
-- Name: items_pedido_id_item_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_pedido_id_item_seq OWNED BY public.items_pedido.id_item;


--
-- TOC entry 259 (class 1259 OID 122986)
-- Name: logros_usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logros_usuarios (
    id_logro integer NOT NULL,
    id_usuario integer NOT NULL,
    tipo_logro character varying(50) NOT NULL,
    nombre_logro character varying(100) NOT NULL,
    descripcion text,
    icono character varying(50),
    fecha_obtencion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    nivel integer DEFAULT 1
);


ALTER TABLE public.logros_usuarios OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 122985)
-- Name: logros_usuarios_id_logro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logros_usuarios_id_logro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logros_usuarios_id_logro_seq OWNER TO postgres;

--
-- TOC entry 3977 (class 0 OID 0)
-- Dependencies: 258
-- Name: logros_usuarios_id_logro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logros_usuarios_id_logro_seq OWNED BY public.logros_usuarios.id_logro;


--
-- TOC entry 253 (class 1259 OID 99256)
-- Name: mensajes_contacto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mensajes_contacto (
    id_mensaje integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    telefono character varying(20),
    id_evento integer,
    motivo character varying(50) NOT NULL,
    asunto character varying(200) NOT NULL,
    mensaje text NOT NULL,
    archivo_adjunto text,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mensajes_contacto OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 99255)
-- Name: mensajes_contacto_id_mensaje_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mensajes_contacto_id_mensaje_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mensajes_contacto_id_mensaje_seq OWNER TO postgres;

--
-- TOC entry 3978 (class 0 OID 0)
-- Dependencies: 252
-- Name: mensajes_contacto_id_mensaje_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mensajes_contacto_id_mensaje_seq OWNED BY public.mensajes_contacto.id_mensaje;


--
-- TOC entry 229 (class 1259 OID 99065)
-- Name: miembros_equipo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.miembros_equipo (
    id_equipo integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha_union timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.miembros_equipo OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 123002)
-- Name: objetivos_usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.objetivos_usuarios (
    id_objetivo integer NOT NULL,
    id_usuario integer NOT NULL,
    tipo_objetivo character varying(50) NOT NULL,
    descripcion text NOT NULL,
    meta_valor numeric(10,2),
    progreso_actual numeric(10,2) DEFAULT 0,
    fecha_inicio date NOT NULL,
    fecha_objetivo date,
    completado boolean DEFAULT false,
    CONSTRAINT objetivos_progreso_valido CHECK ((progreso_actual <= meta_valor))
);


ALTER TABLE public.objetivos_usuarios OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 123001)
-- Name: objetivos_usuarios_id_objetivo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.objetivos_usuarios_id_objetivo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.objetivos_usuarios_id_objetivo_seq OWNER TO postgres;

--
-- TOC entry 3979 (class 0 OID 0)
-- Dependencies: 260
-- Name: objetivos_usuarios_id_objetivo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.objetivos_usuarios_id_objetivo_seq OWNED BY public.objetivos_usuarios.id_objetivo;


--
-- TOC entry 237 (class 1259 OID 99139)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id_pago integer NOT NULL,
    id_inscripcion integer NOT NULL,
    fecha_pago date,
    numero_referencia character varying(100),
    url_comprobante text,
    estado public.estado_pago NOT NULL
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 99138)
-- Name: pagos_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_pago_seq OWNER TO postgres;

--
-- TOC entry 3980 (class 0 OID 0)
-- Dependencies: 236
-- Name: pagos_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_pago_seq OWNED BY public.pagos.id_pago;


--
-- TOC entry 269 (class 1259 OID 123069)
-- Name: pedidos_tienda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos_tienda (
    id_pedido integer NOT NULL,
    id_usuario integer NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    total numeric(10,2) NOT NULL,
    direccion_envio jsonb,
    fecha_pedido timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pedidos_tienda_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'confirmado'::character varying, 'enviado'::character varying, 'entregado'::character varying, 'cancelado'::character varying])::text[])))
);


ALTER TABLE public.pedidos_tienda OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 123068)
-- Name: pedidos_tienda_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_tienda_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_tienda_id_pedido_seq OWNER TO postgres;

--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 268
-- Name: pedidos_tienda_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_tienda_id_pedido_seq OWNED BY public.pedidos_tienda.id_pedido;


--
-- TOC entry 249 (class 1259 OID 99228)
-- Name: planes_suscripcion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planes_suscripcion (
    id_plan integer NOT NULL,
    nombre character varying(50) NOT NULL,
    precio_mensual numeric(8,2) NOT NULL,
    descripcion text,
    caracteristicas jsonb,
    activo boolean DEFAULT true
);


ALTER TABLE public.planes_suscripcion OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 99227)
-- Name: planes_suscripcion_id_plan_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.planes_suscripcion_id_plan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planes_suscripcion_id_plan_seq OWNER TO postgres;

--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 248
-- Name: planes_suscripcion_id_plan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.planes_suscripcion_id_plan_seq OWNED BY public.planes_suscripcion.id_plan;


--
-- TOC entry 267 (class 1259 OID 123057)
-- Name: productos_tienda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos_tienda (
    id_producto integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    categoria character varying(50) NOT NULL,
    imagenes jsonb,
    inventario integer DEFAULT 0,
    activo boolean DEFAULT true,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.productos_tienda OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 123056)
-- Name: productos_tienda_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_tienda_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_tienda_id_producto_seq OWNER TO postgres;

--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 266
-- Name: productos_tienda_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_tienda_id_producto_seq OWNED BY public.productos_tienda.id_producto;


--
-- TOC entry 241 (class 1259 OID 99167)
-- Name: puntos_control; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puntos_control (
    id_punto_control integer NOT NULL,
    id_ruta integer NOT NULL,
    nombre character varying(100) NOT NULL,
    orden integer NOT NULL
);


ALTER TABLE public.puntos_control OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 99166)
-- Name: puntos_control_id_punto_control_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.puntos_control_id_punto_control_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.puntos_control_id_punto_control_seq OWNER TO postgres;

--
-- TOC entry 3984 (class 0 OID 0)
-- Dependencies: 240
-- Name: puntos_control_id_punto_control_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.puntos_control_id_punto_control_seq OWNED BY public.puntos_control.id_punto_control;


--
-- TOC entry 265 (class 1259 OID 123036)
-- Name: reportes_problemas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reportes_problemas (
    id_reporte integer NOT NULL,
    id_usuario integer,
    tipo_reporte character varying(50) NOT NULL,
    titulo character varying(200) NOT NULL,
    descripcion text NOT NULL,
    metadatos jsonb,
    archivo_adjunto text,
    estado character varying(20) DEFAULT 'abierto'::character varying,
    prioridad character varying(20) DEFAULT 'media'::character varying,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reportes_problemas_estado_check CHECK (((estado)::text = ANY ((ARRAY['abierto'::character varying, 'en_progreso'::character varying, 'resuelto'::character varying, 'cerrado'::character varying])::text[]))),
    CONSTRAINT reportes_problemas_prioridad_check CHECK (((prioridad)::text = ANY ((ARRAY['baja'::character varying, 'media'::character varying, 'alta'::character varying, 'critica'::character varying])::text[]))),
    CONSTRAINT reportes_problemas_tipo_reporte_check CHECK (((tipo_reporte)::text = ANY ((ARRAY['tecnico'::character varying, 'evento'::character varying, 'usuario'::character varying, 'otro'::character varying])::text[])))
);


ALTER TABLE public.reportes_problemas OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 123035)
-- Name: reportes_problemas_id_reporte_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reportes_problemas_id_reporte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reportes_problemas_id_reporte_seq OWNER TO postgres;

--
-- TOC entry 3985 (class 0 OID 0)
-- Dependencies: 264
-- Name: reportes_problemas_id_reporte_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reportes_problemas_id_reporte_seq OWNED BY public.reportes_problemas.id_reporte;


--
-- TOC entry 245 (class 1259 OID 99196)
-- Name: resultados_carrera; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultados_carrera (
    id_resultado integer NOT NULL,
    id_inscripcion integer NOT NULL,
    posicion_general integer,
    posicion_categoria integer,
    tiempo_total interval,
    estado public.estado_resultado NOT NULL
);


ALTER TABLE public.resultados_carrera OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 99195)
-- Name: resultados_carrera_id_resultado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resultados_carrera_id_resultado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultados_carrera_id_resultado_seq OWNER TO postgres;

--
-- TOC entry 3986 (class 0 OID 0)
-- Dependencies: 244
-- Name: resultados_carrera_id_resultado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resultados_carrera_id_resultado_seq OWNED BY public.resultados_carrera.id_resultado;


--
-- TOC entry 247 (class 1259 OID 99210)
-- Name: resultados_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultados_evento (
    id_resultado_evento integer NOT NULL,
    id_evento integer NOT NULL,
    id_usuario integer NOT NULL,
    posicion integer,
    tiempo_total interval,
    categoria character varying(50),
    distancia_completada numeric(8,2),
    fecha_registro timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.resultados_evento OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 99209)
-- Name: resultados_evento_id_resultado_evento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resultados_evento_id_resultado_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultados_evento_id_resultado_evento_seq OWNER TO postgres;

--
-- TOC entry 3987 (class 0 OID 0)
-- Dependencies: 246
-- Name: resultados_evento_id_resultado_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resultados_evento_id_resultado_evento_seq OWNED BY public.resultados_evento.id_resultado_evento;


--
-- TOC entry 239 (class 1259 OID 99155)
-- Name: rutas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rutas (
    id_ruta integer NOT NULL,
    id_evento integer NOT NULL,
    nombre character varying(100) NOT NULL,
    distancia_km numeric(6,2)
);


ALTER TABLE public.rutas OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 99154)
-- Name: rutas_id_ruta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rutas_id_ruta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rutas_id_ruta_seq OWNER TO postgres;

--
-- TOC entry 3988 (class 0 OID 0)
-- Dependencies: 238
-- Name: rutas_id_ruta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rutas_id_ruta_seq OWNED BY public.rutas.id_ruta;


--
-- TOC entry 273 (class 1259 OID 123113)
-- Name: sectores_ruta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sectores_ruta (
    id_sector integer NOT NULL,
    id_ruta integer NOT NULL,
    nombre character varying(100) NOT NULL,
    distancia_km numeric(6,2),
    elevacion_ganada numeric(8,2),
    dificultad_sugerida character varying(20),
    orden integer NOT NULL
);


ALTER TABLE public.sectores_ruta OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 123112)
-- Name: sectores_ruta_id_sector_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sectores_ruta_id_sector_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sectores_ruta_id_sector_seq OWNER TO postgres;

--
-- TOC entry 3989 (class 0 OID 0)
-- Dependencies: 272
-- Name: sectores_ruta_id_sector_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sectores_ruta_id_sector_seq OWNED BY public.sectores_ruta.id_sector;


--
-- TOC entry 251 (class 1259 OID 99238)
-- Name: suscripciones_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suscripciones_usuario (
    id_suscripcion integer NOT NULL,
    id_usuario integer NOT NULL,
    id_plan integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date,
    activa boolean DEFAULT true
);


ALTER TABLE public.suscripciones_usuario OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 99237)
-- Name: suscripciones_usuario_id_suscripcion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suscripciones_usuario_id_suscripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suscripciones_usuario_id_suscripcion_seq OWNER TO postgres;

--
-- TOC entry 3990 (class 0 OID 0)
-- Dependencies: 250
-- Name: suscripciones_usuario_id_suscripcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suscripciones_usuario_id_suscripcion_seq OWNED BY public.suscripciones_usuario.id_suscripcion;


--
-- TOC entry 231 (class 1259 OID 99082)
-- Name: tallas_playera; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tallas_playera (
    id_talla_playera integer NOT NULL,
    nombre character varying(10) NOT NULL,
    descripcion character varying(50)
);


ALTER TABLE public.tallas_playera OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 99091)
-- Name: tallas_playera_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tallas_playera_evento (
    id_talla_evento integer NOT NULL,
    id_evento integer NOT NULL,
    nombre_talla character varying(10) NOT NULL,
    disponibles integer NOT NULL,
    CONSTRAINT tallas_playera_evento_disponibles_check1 CHECK ((disponibles >= 0))
);


ALTER TABLE public.tallas_playera_evento OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 99090)
-- Name: tallas_playera_evento_id_talla_evento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tallas_playera_evento_id_talla_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tallas_playera_evento_id_talla_evento_seq OWNER TO postgres;

--
-- TOC entry 3991 (class 0 OID 0)
-- Dependencies: 232
-- Name: tallas_playera_evento_id_talla_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tallas_playera_evento_id_talla_evento_seq OWNED BY public.tallas_playera_evento.id_talla_evento;


--
-- TOC entry 230 (class 1259 OID 99081)
-- Name: tallas_playera_id_talla_playera_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tallas_playera_id_talla_playera_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tallas_playera_id_talla_playera_seq OWNER TO postgres;

--
-- TOC entry 3992 (class 0 OID 0)
-- Dependencies: 230
-- Name: tallas_playera_id_talla_playera_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tallas_playera_id_talla_playera_seq OWNED BY public.tallas_playera.id_talla_playera;


--
-- TOC entry 243 (class 1259 OID 99179)
-- Name: tiempos_carrera; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiempos_carrera (
    id_tiempo integer NOT NULL,
    id_inscripcion integer NOT NULL,
    id_punto_control integer NOT NULL,
    marca_tiempo timestamp with time zone NOT NULL
);


ALTER TABLE public.tiempos_carrera OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 99178)
-- Name: tiempos_carrera_id_tiempo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tiempos_carrera_id_tiempo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tiempos_carrera_id_tiempo_seq OWNER TO postgres;

--
-- TOC entry 3993 (class 0 OID 0)
-- Dependencies: 242
-- Name: tiempos_carrera_id_tiempo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tiempos_carrera_id_tiempo_seq OWNED BY public.tiempos_carrera.id_tiempo;


--
-- TOC entry 218 (class 1259 OID 98964)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    contrasena character varying(255) NOT NULL,
    rol public.rol_usuario DEFAULT 'usuario'::public.rol_usuario NOT NULL,
    telefono character varying(20),
    url_imagen_perfil text,
    telefono_verificado boolean DEFAULT false,
    puede_crear_equipo boolean DEFAULT false,
    fecha_verificacion timestamp with time zone,
    ultimo_acceso timestamp with time zone,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    onboarding_completado boolean DEFAULT false,
    intereses jsonb,
    configuracion_notificaciones jsonb DEFAULT '{"push": true, "email": true, "marketing": false}'::jsonb,
    tema_preferido character varying(20) DEFAULT 'claro'::character varying,
    idioma character varying(10) DEFAULT 'es'::character varying,
    privacidad_perfil character varying(20) DEFAULT 'publico'::character varying,
    reset_password_token character varying(255) DEFAULT NULL::character varying,
    reset_password_expires timestamp with time zone,
    CONSTRAINT usuarios_privacidad_perfil_check CHECK (((privacidad_perfil)::text = ANY ((ARRAY['publico'::character varying, 'amigos'::character varying, 'privado'::character varying])::text[]))),
    CONSTRAINT usuarios_tema_preferido_check CHECK (((tema_preferido)::text = ANY ((ARRAY['claro'::character varying, 'oscuro'::character varying, 'auto'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 98963)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 3994 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 279 (class 1259 OID 123162)
-- Name: vista_analisis_participacion; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_analisis_participacion AS
 SELECT date_trunc('month'::text, i.fecha_inscripcion) AS mes,
    count(i.id_inscripcion) AS total_inscripciones,
    count(DISTINCT i.id_usuario) AS usuarios_unicos,
    avg(e.distancia_km) AS distancia_promedio_eventos,
    avg(e.cuota_inscripcion) AS cuota_promedio,
    count(DISTINCT e.id_evento) AS eventos_realizados
   FROM (public.inscripciones i
     JOIN public.eventos e ON ((i.id_evento = e.id_evento)))
  WHERE (i.fecha_inscripcion IS NOT NULL)
  GROUP BY (date_trunc('month'::text, i.fecha_inscripcion))
  ORDER BY (date_trunc('month'::text, i.fecha_inscripcion)) DESC;


ALTER VIEW public.vista_analisis_participacion OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 123226)
-- Name: vista_analisis_participacion_mensual; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_analisis_participacion_mensual AS
 SELECT date_trunc('month'::text, COALESCE(i.fecha_inscripcion, e.fecha_creacion)) AS mes,
    count(DISTINCT e.id_evento) AS eventos_realizados,
    count(DISTINCT i.id_inscripcion) AS total_inscripciones,
    count(DISTINCT i.id_usuario) AS usuarios_unicos,
    count(DISTINCT e.id_organizador) AS organizadores_activos,
    avg(e.distancia_km) AS distancia_promedio,
    avg(e.cuota_inscripcion) AS cuota_promedio,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN e.cuota_inscripcion
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_totales
   FROM ((public.eventos e
     LEFT JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
  WHERE (e.fecha_inicio IS NOT NULL)
  GROUP BY (date_trunc('month'::text, COALESCE(i.fecha_inscripcion, e.fecha_creacion)))
  ORDER BY (date_trunc('month'::text, COALESCE(i.fecha_inscripcion, e.fecha_creacion))) DESC;


ALTER VIEW public.vista_analisis_participacion_mensual OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 123137)
-- Name: vista_dashboard_admin; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_dashboard_admin AS
 SELECT ( SELECT count(*) AS count
           FROM public.usuarios) AS total_usuarios,
    ( SELECT count(*) AS count
           FROM public.usuarios
          WHERE (usuarios.fecha_creacion >= (CURRENT_DATE - '30 days'::interval))) AS usuarios_nuevos_30d,
    ( SELECT count(*) AS count
           FROM public.eventos) AS total_eventos,
    ( SELECT count(*) AS count
           FROM public.eventos
          WHERE (eventos.estado = 'proximo'::public.estado_evento)) AS eventos_proximos,
    ( SELECT COALESCE(sum(e.cuota_inscripcion), (0)::numeric) AS "coalesce"
           FROM ((public.inscripciones i
             JOIN public.eventos e ON ((i.id_evento = e.id_evento)))
             JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
          WHERE ((p.estado = 'aprobado'::public.estado_pago) AND (p.fecha_pago >= (CURRENT_DATE - '30 days'::interval)))) AS ingresos_30d;


ALTER VIEW public.vista_dashboard_admin OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 123191)
-- Name: vista_dashboard_organizador; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_dashboard_organizador AS
 SELECT u.id_usuario AS id_organizador,
    u.nombre_completo AS nombre_organizador,
    count(DISTINCT e.id_evento) AS total_eventos,
    count(DISTINCT
        CASE
            WHEN (e.estado = 'proximo'::public.estado_evento) THEN e.id_evento
            ELSE NULL::integer
        END) AS eventos_proximos,
    count(DISTINCT
        CASE
            WHEN (e.estado = 'en_curso'::public.estado_evento) THEN e.id_evento
            ELSE NULL::integer
        END) AS eventos_en_curso,
    count(DISTINCT
        CASE
            WHEN (e.estado = 'finalizado'::public.estado_evento) THEN e.id_evento
            ELSE NULL::integer
        END) AS eventos_finalizados,
    count(DISTINCT i.id_inscripcion) AS total_inscripciones,
    count(DISTINCT eq.id_equipo) AS total_equipos,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN e.cuota_inscripcion
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_totales
   FROM ((((public.usuarios u
     JOIN public.eventos e ON ((u.id_usuario = e.id_organizador)))
     LEFT JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     LEFT JOIN public.equipos eq ON ((i.id_equipo = eq.id_equipo)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
  WHERE (u.rol = ANY (ARRAY['organizador'::public.rol_usuario, 'administrador'::public.rol_usuario]))
  GROUP BY u.id_usuario, u.nombre_completo;


ALTER VIEW public.vista_dashboard_organizador OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 123236)
-- Name: vista_dashboard_resumen; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_dashboard_resumen AS
 SELECT ( SELECT count(*) AS count
           FROM public.usuarios) AS total_usuarios,
    ( SELECT count(*) AS count
           FROM public.eventos) AS total_eventos,
    ( SELECT count(*) AS count
           FROM public.equipos
          WHERE (equipos.activo = true)) AS total_equipos,
    ( SELECT count(*) AS count
           FROM public.inscripciones
          WHERE (inscripciones.estado = 'confirmada'::public.estado_inscripcion)) AS inscripciones_confirmadas,
    ( SELECT count(*) AS count
           FROM public.eventos
          WHERE ((eventos.estado = 'proximo'::public.estado_evento) AND ((eventos.fecha_inicio >= CURRENT_TIMESTAMP) AND (eventos.fecha_inicio <= (CURRENT_TIMESTAMP + '7 days'::interval))))) AS eventos_proxima_semana,
    ( SELECT COALESCE(sum(e.cuota_inscripcion), (0)::numeric) AS "coalesce"
           FROM ((public.inscripciones i
             JOIN public.eventos e ON ((i.id_evento = e.id_evento)))
             JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
          WHERE ((p.estado = 'aprobado'::public.estado_pago) AND (p.fecha_pago >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)))) AS ingresos_mes_actual,
    ( SELECT count(*) AS count
           FROM public.usuarios
          WHERE (usuarios.fecha_creacion >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))) AS nuevos_usuarios_mes;


ALTER VIEW public.vista_dashboard_resumen OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 123216)
-- Name: vista_equipos_completa; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_equipos_completa AS
 SELECT e.id_equipo,
    e.nombre AS nombre_equipo,
    e.descripcion,
    e.activo,
    u_capitan.id_usuario AS id_capitan,
    u_capitan.nombre_completo AS nombre_capitan,
    u_capitan.correo_electronico AS email_capitan,
    count(DISTINCT me.id_usuario) AS total_miembros,
    count(DISTINCT i.id_inscripcion) AS inscripciones_activas,
    array_agg(DISTINCT u_miembro.nombre_completo) AS nombres_miembros,
    e.fecha_creacion,
    e.fecha_actualizacion
   FROM ((((public.equipos e
     JOIN public.usuarios u_capitan ON ((e.id_capitan = u_capitan.id_usuario)))
     LEFT JOIN public.miembros_equipo me ON ((e.id_equipo = me.id_equipo)))
     LEFT JOIN public.usuarios u_miembro ON ((me.id_usuario = u_miembro.id_usuario)))
     LEFT JOIN public.inscripciones i ON (((e.id_equipo = i.id_equipo) AND (i.estado = 'confirmada'::public.estado_inscripcion))))
  GROUP BY e.id_equipo, e.nombre, e.descripcion, e.activo, u_capitan.id_usuario, u_capitan.nombre_completo, u_capitan.correo_electronico, e.fecha_creacion, e.fecha_actualizacion;


ALTER VIEW public.vista_equipos_completa OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 99284)
-- Name: vista_equipos_detallados; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_equipos_detallados AS
 SELECT e.id_equipo,
    e.nombre AS nombre_equipo,
    e.descripcion,
    e.enlace_invitacion,
    e.fecha_creacion,
    u_capitan.id_usuario AS id_capitan,
    u_capitan.nombre_completo AS nombre_capitan,
    count(me.id_usuario) AS total_miembros,
    array_agg(DISTINCT u_miembro.nombre_completo) AS nombres_miembros
   FROM (((public.equipos e
     JOIN public.usuarios u_capitan ON ((e.id_capitan = u_capitan.id_usuario)))
     LEFT JOIN public.miembros_equipo me ON ((e.id_equipo = me.id_equipo)))
     LEFT JOIN public.usuarios u_miembro ON ((me.id_usuario = u_miembro.id_usuario)))
  WHERE ((e.activo = true) OR (e.activo IS NULL))
  GROUP BY e.id_equipo, e.nombre, e.descripcion, e.enlace_invitacion, e.fecha_creacion, u_capitan.id_usuario, u_capitan.nombre_completo;


ALTER VIEW public.vista_equipos_detallados OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 123167)
-- Name: vista_equipos_detallados_mejorada; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_equipos_detallados_mejorada AS
 SELECT e.id_equipo,
    e.nombre AS nombre_equipo,
    e.descripcion,
    e.activo,
    u_capitan.id_usuario AS id_capitan,
    u_capitan.nombre_completo AS nombre_capitan,
    count(me.id_usuario) AS total_miembros,
    count(DISTINCT i.id_inscripcion) AS inscripciones_totales,
    array_agg(DISTINCT u_miembro.nombre_completo) AS nombres_miembros,
    e.fecha_creacion,
    e.fecha_actualizacion
   FROM ((((public.equipos e
     JOIN public.usuarios u_capitan ON ((e.id_capitan = u_capitan.id_usuario)))
     LEFT JOIN public.miembros_equipo me ON ((e.id_equipo = me.id_equipo)))
     LEFT JOIN public.usuarios u_miembro ON ((me.id_usuario = u_miembro.id_usuario)))
     LEFT JOIN public.inscripciones i ON (((e.id_equipo = i.id_equipo) AND (i.estado = 'confirmada'::public.estado_inscripcion))))
  GROUP BY e.id_equipo, e.nombre, e.descripcion, e.activo, u_capitan.id_usuario, u_capitan.nombre_completo, e.fecha_creacion, e.fecha_actualizacion;


ALTER VIEW public.vista_equipos_detallados_mejorada OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 123142)
-- Name: vista_estadisticas_usuario; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_estadisticas_usuario AS
 SELECT u.id_usuario,
    u.nombre_completo,
    count(DISTINCT i.id_inscripcion) AS total_eventos,
    count(DISTINCT
        CASE
            WHEN (i.estado = 'confirmada'::public.estado_inscripcion) THEN i.id_inscripcion
            ELSE NULL::integer
        END) AS eventos_confirmados,
    count(DISTINCT
        CASE
            WHEN (i.estado = 'pendiente'::public.estado_inscripcion) THEN i.id_inscripcion
            ELSE NULL::integer
        END) AS eventos_pendientes,
    COALESCE(sum(i.distancia_completada), (0)::numeric) AS km_totales,
    avg(EXTRACT(epoch FROM i.tiempo_total)) AS tiempo_promedio_segundos,
    count(DISTINCT me.id_equipo) AS equipos_pertenece,
    count(DISTINCT e.id_equipo) AS equipos_lidera
   FROM (((public.usuarios u
     LEFT JOIN public.inscripciones i ON ((u.id_usuario = i.id_usuario)))
     LEFT JOIN public.miembros_equipo me ON ((u.id_usuario = me.id_usuario)))
     LEFT JOIN public.equipos e ON ((u.id_usuario = e.id_capitan)))
  GROUP BY u.id_usuario, u.nombre_completo;


ALTER VIEW public.vista_estadisticas_usuario OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 123147)
-- Name: vista_eventos_organizador; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_eventos_organizador AS
 SELECT e.id_evento,
    e.nombre,
    e.estado,
    e.fecha_inicio,
    e.fecha_limite_inscripcion,
    e.maximo_participantes,
    count(i.id_inscripcion) AS participantes_inscritos,
    count(
        CASE
            WHEN (i.estado = 'confirmada'::public.estado_inscripcion) THEN i.id_inscripcion
            ELSE NULL::integer
        END) AS participantes_confirmados,
    count(DISTINCT eq.id_equipo) AS equipos_inscritos,
    COALESCE(sum(e.cuota_inscripcion), (0)::numeric) AS ingresos_totales
   FROM ((public.eventos e
     LEFT JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     LEFT JOIN public.equipos eq ON ((i.id_equipo = eq.id_equipo)))
  GROUP BY e.id_evento, e.nombre, e.estado, e.fecha_inicio, e.fecha_limite_inscripcion, e.maximo_participantes;


ALTER VIEW public.vista_eventos_organizador OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 123241)
-- Name: vista_eventos_proximos_detalle; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_eventos_proximos_detalle AS
 SELECT e.id_evento,
    e.nombre,
    e.fecha_inicio,
    e.ubicacion,
    e.distancia_km,
    e.dificultad,
    e.cuota_inscripcion,
    e.maximo_participantes,
    u.nombre_completo AS organizador,
    count(i.id_inscripcion) AS inscritos_actuales,
    (e.maximo_participantes - count(i.id_inscripcion)) AS cupos_disponibles,
        CASE
            WHEN (count(i.id_inscripcion) >= e.maximo_participantes) THEN 'agotado'::text
            WHEN ((count(i.id_inscripcion))::numeric >= ((e.maximo_participantes)::numeric * 0.8)) THEN 'pocos_cupos'::text
            ELSE 'disponible'::text
        END AS estado_cupos
   FROM ((public.eventos e
     JOIN public.usuarios u ON ((e.id_organizador = u.id_usuario)))
     LEFT JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
  WHERE ((e.estado = 'proximo'::public.estado_evento) AND (e.fecha_inicio > CURRENT_TIMESTAMP))
  GROUP BY e.id_evento, e.nombre, e.fecha_inicio, e.ubicacion, e.distancia_km, e.dificultad, e.cuota_inscripcion, e.maximo_participantes, u.nombre_completo
  ORDER BY e.fecha_inicio;


ALTER VIEW public.vista_eventos_proximos_detalle OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 123183)
-- Name: vista_eventos_usuario; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_eventos_usuario AS
 SELECT i.id_inscripcion,
    i.id_usuario,
    e.id_evento,
    e.nombre AS evento,
    e.fecha_inicio,
    e.fecha_fin,
    e.ubicacion,
    e.distancia_km,
    e.dificultad,
    e.estado AS estado_evento,
    i.estado AS estado_inscripcion,
    p.estado AS estado_pago,
    c.nombre AS categoria,
    eq.nombre AS equipo,
    i.numero_dorsal,
    i.alias_dorsal,
    i.tiempo_total,
    i.posicion_general,
    i.distancia_completada
   FROM (((((public.inscripciones i
     JOIN public.eventos e ON ((i.id_evento = e.id_evento)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
     LEFT JOIN public.categorias_evento ce ON ((i.id_categoria = ce.id_categoria_evento)))
     LEFT JOIN public.categorias c ON ((ce.id_categoria = c.id_categoria)))
     LEFT JOIN public.equipos eq ON ((i.id_equipo = eq.id_equipo)))
  ORDER BY e.fecha_inicio DESC;


ALTER VIEW public.vista_eventos_usuario OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 123221)
-- Name: vista_finanzas_eventos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_finanzas_eventos AS
 SELECT e.id_evento,
    e.nombre AS evento,
    e.fecha_inicio,
    u.nombre_completo AS organizador,
    e.cuota_inscripcion,
    count(i.id_inscripcion) AS total_inscripciones,
    count(p.id_pago) AS pagos_registrados,
    count(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN 1
            ELSE NULL::integer
        END) AS pagos_aprobados,
    count(
        CASE
            WHEN (p.estado = 'pendiente'::public.estado_pago) THEN 1
            ELSE NULL::integer
        END) AS pagos_pendientes,
    count(
        CASE
            WHEN (p.estado = 'rechazado'::public.estado_pago) THEN 1
            ELSE NULL::integer
        END) AS pagos_rechazados,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN e.cuota_inscripcion
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_aprobados,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'pendiente'::public.estado_pago) THEN e.cuota_inscripcion
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_pendientes,
    round((((count(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(p.id_pago), 0))::numeric), 2) AS tasa_aprobacion
   FROM (((public.eventos e
     JOIN public.usuarios u ON ((e.id_organizador = u.id_usuario)))
     LEFT JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
  GROUP BY e.id_evento, e.nombre, e.fecha_inicio, u.nombre_completo, e.cuota_inscripcion;


ALTER VIEW public.vista_finanzas_eventos OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 123206)
-- Name: vista_gestion_eventos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_gestion_eventos AS
 SELECT e.id_evento,
    e.nombre,
    e.estado,
    e.fecha_inicio,
    e.fecha_limite_inscripcion,
    e.ubicacion,
    e.distancia_km,
    e.dificultad,
    e.cuota_inscripcion,
    e.maximo_participantes,
    u.nombre_completo AS organizador,
    count(i.id_inscripcion) AS total_inscritos,
    count(
        CASE
            WHEN (i.estado = 'confirmada'::public.estado_inscripcion) THEN 1
            ELSE NULL::integer
        END) AS confirmados,
    count(
        CASE
            WHEN (i.estado = 'pendiente'::public.estado_inscripcion) THEN 1
            ELSE NULL::integer
        END) AS pendientes,
    count(DISTINCT eq.id_equipo) AS equipos_inscritos,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN e.cuota_inscripcion
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_confirmados
   FROM ((((public.eventos e
     JOIN public.usuarios u ON ((e.id_organizador = u.id_usuario)))
     LEFT JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     LEFT JOIN public.equipos eq ON ((i.id_equipo = eq.id_equipo)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
  GROUP BY e.id_evento, e.nombre, e.estado, e.fecha_inicio, e.fecha_limite_inscripcion, e.ubicacion, e.distancia_km, e.dificultad, e.cuota_inscripcion, e.maximo_participantes, u.nombre_completo;


ALTER VIEW public.vista_gestion_eventos OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 123196)
-- Name: vista_integraciones_usuario; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_integraciones_usuario AS
 SELECT u.id_usuario,
    u.nombre_completo,
    u.correo_electronico,
    count(DISTINCT i.id_inscripcion) AS eventos_inscritos,
    count(DISTINCT me.id_equipo) AS equipos_pertenece,
    COALESCE(sum(i.distancia_completada), (0)::numeric) AS km_totales_recorridos
   FROM ((public.usuarios u
     LEFT JOIN public.inscripciones i ON ((u.id_usuario = i.id_usuario)))
     LEFT JOIN public.miembros_equipo me ON ((u.id_usuario = me.id_usuario)))
  GROUP BY u.id_usuario, u.nombre_completo, u.correo_electronico;


ALTER VIEW public.vista_integraciones_usuario OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 123201)
-- Name: vista_mensajes_contacto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_mensajes_contacto AS
 SELECT mc.id_mensaje,
    mc.nombre_completo,
    mc.correo_electronico,
    mc.telefono,
    mc.motivo,
    mc.asunto,
    mc.estado,
    mc.fecha_creacion,
    e.nombre AS nombre_evento,
        CASE
            WHEN ((mc.estado)::text = 'pendiente'::text) THEN 'warning'::text
            WHEN ((mc.estado)::text = 'respondido'::text) THEN 'success'::text
            ELSE 'secondary'::text
        END AS color_estado
   FROM (public.mensajes_contacto mc
     LEFT JOIN public.eventos e ON ((mc.id_evento = e.id_evento)))
  ORDER BY mc.fecha_creacion DESC;


ALTER VIEW public.vista_mensajes_contacto OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 123211)
-- Name: vista_participantes_evento; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_participantes_evento AS
 SELECT i.id_inscripcion,
    i.id_evento,
    e.nombre AS evento,
    i.id_usuario,
    u.nombre_completo,
    u.correo_electronico,
    i.numero_dorsal,
    i.alias_dorsal,
    i.estado AS estado_inscripcion,
    p.estado AS estado_pago,
    c.nombre AS categoria,
    eq.nombre AS equipo,
    i.tiempo_total,
    i.posicion_general,
    i.distancia_completada,
    dc.telefono_emergencia,
    dc.contacto_emergencia
   FROM (((((((public.inscripciones i
     JOIN public.eventos e ON ((i.id_evento = e.id_evento)))
     JOIN public.usuarios u ON ((i.id_usuario = u.id_usuario)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
     LEFT JOIN public.categorias_evento ce ON ((i.id_categoria = ce.id_categoria_evento)))
     LEFT JOIN public.categorias c ON ((ce.id_categoria = c.id_categoria)))
     LEFT JOIN public.equipos eq ON ((i.id_equipo = eq.id_equipo)))
     LEFT JOIN public.datos_ciclista dc ON ((i.id_usuario = dc.id_usuario)))
  ORDER BY e.fecha_inicio DESC, i.estado, u.nombre_completo;


ALTER VIEW public.vista_participantes_evento OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 123178)
-- Name: vista_proximos_eventos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_proximos_eventos AS
 SELECT i.id_inscripcion,
    i.id_usuario,
    e.id_evento,
    e.nombre AS evento,
    e.fecha_inicio,
    e.ubicacion,
    e.distancia_km,
    e.dificultad,
    i.estado AS estado_inscripcion,
    p.estado AS estado_pago,
    c.nombre AS categoria,
    eq.nombre AS equipo,
    u.nombre_completo AS nombre_usuario
   FROM ((((((public.inscripciones i
     JOIN public.eventos e ON ((i.id_evento = e.id_evento)))
     JOIN public.usuarios u ON ((i.id_usuario = u.id_usuario)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
     LEFT JOIN public.categorias_evento ce ON ((i.id_categoria = ce.id_categoria_evento)))
     LEFT JOIN public.categorias c ON ((ce.id_categoria = c.id_categoria)))
     LEFT JOIN public.equipos eq ON ((i.id_equipo = eq.id_equipo)))
  WHERE ((e.fecha_inicio > CURRENT_TIMESTAMP) AND (i.estado = 'confirmada'::public.estado_inscripcion))
  ORDER BY e.fecha_inicio;


ALTER VIEW public.vista_proximos_eventos OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 123157)
-- Name: vista_reportes_financieros; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_reportes_financieros AS
 SELECT e.id_evento,
    e.nombre AS evento,
    count(i.id_inscripcion) AS total_inscripciones,
    count(p.id_pago) AS pagos_realizados,
    count(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN p.id_pago
            ELSE NULL::integer
        END) AS pagos_aprobados,
    count(
        CASE
            WHEN (p.estado = 'pendiente'::public.estado_pago) THEN p.id_pago
            ELSE NULL::integer
        END) AS pagos_pendientes,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'aprobado'::public.estado_pago) THEN e.cuota_inscripcion
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_aprobados,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'pendiente'::public.estado_pago) THEN e.cuota_inscripcion
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_pendientes
   FROM ((public.eventos e
     LEFT JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     LEFT JOIN public.pagos p ON ((i.id_inscripcion = p.id_inscripcion)))
  GROUP BY e.id_evento, e.nombre;


ALTER VIEW public.vista_reportes_financieros OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 99289)
-- Name: vista_resultados_completos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_resultados_completos AS
 SELECT e.id_evento,
    e.nombre AS nombre_evento,
    u.id_usuario,
    u.nombre_completo,
    i.numero_dorsal,
    i.alias_dorsal,
    c.nombre AS categoria,
    COALESCE(i.tiempo_total, re.tiempo_total) AS tiempo_total,
    COALESCE(i.posicion_general, re.posicion) AS posicion_general,
    COALESCE(i.distancia_completada, re.distancia_completada) AS distancia_completada,
    re.fecha_registro
   FROM (((((public.eventos e
     JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     JOIN public.usuarios u ON ((i.id_usuario = u.id_usuario)))
     LEFT JOIN public.categorias_evento ec ON ((i.id_categoria = ec.id_categoria_evento)))
     LEFT JOIN public.categorias c ON ((ec.id_categoria = c.id_categoria)))
     LEFT JOIN public.resultados_evento re ON (((e.id_evento = re.id_evento) AND (u.id_usuario = re.id_usuario))))
  WHERE (i.estado = 'confirmada'::public.estado_inscripcion);


ALTER VIEW public.vista_resultados_completos OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 123152)
-- Name: vista_resultados_detallados; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_resultados_detallados AS
 SELECT e.id_evento,
    e.nombre AS nombre_evento,
    u.id_usuario,
    u.nombre_completo,
    i.numero_dorsal,
    i.alias_dorsal,
    c.nombre AS categoria,
    COALESCE(i.tiempo_total, re.tiempo_total) AS tiempo_total,
    COALESCE(i.posicion_general, re.posicion) AS posicion_general,
    COALESCE(i.posicion_categoria, NULL::integer) AS posicion_categoria,
    COALESCE(i.distancia_completada, re.distancia_completada) AS distancia_completada,
    i.ritmo_promedio,
    rc.estado AS estado_resultado,
    re.fecha_registro
   FROM ((((((public.eventos e
     JOIN public.inscripciones i ON ((e.id_evento = i.id_evento)))
     JOIN public.usuarios u ON ((i.id_usuario = u.id_usuario)))
     LEFT JOIN public.categorias_evento ec ON ((i.id_categoria = ec.id_categoria_evento)))
     LEFT JOIN public.categorias c ON ((ec.id_categoria = c.id_categoria)))
     LEFT JOIN public.resultados_evento re ON (((e.id_evento = re.id_evento) AND (u.id_usuario = re.id_usuario))))
     LEFT JOIN public.resultados_carrera rc ON ((i.id_inscripcion = rc.id_inscripcion)))
  WHERE (i.estado = 'confirmada'::public.estado_inscripcion);


ALTER VIEW public.vista_resultados_detallados OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 123231)
-- Name: vista_usuarios_activos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_usuarios_activos AS
 SELECT u.id_usuario,
    u.nombre_completo,
    u.correo_electronico,
    u.rol,
    u.telefono,
    u.fecha_creacion,
    u.ultimo_acceso,
    count(DISTINCT i.id_inscripcion) AS total_inscripciones,
    count(DISTINCT
        CASE
            WHEN (i.estado = 'confirmada'::public.estado_inscripcion) THEN i.id_inscripcion
            ELSE NULL::integer
        END) AS inscripciones_confirmadas,
    count(DISTINCT me.id_equipo) AS equipos_pertenece,
    count(DISTINCT eq.id_equipo) AS equipos_lidera,
    COALESCE(sum(i.distancia_completada), (0)::numeric) AS km_totales,
    dc.tipo_bicicleta,
    dc.nivel_experiencia
   FROM ((((public.usuarios u
     LEFT JOIN public.inscripciones i ON ((u.id_usuario = i.id_usuario)))
     LEFT JOIN public.miembros_equipo me ON ((u.id_usuario = me.id_usuario)))
     LEFT JOIN public.equipos eq ON ((u.id_usuario = eq.id_capitan)))
     LEFT JOIN public.datos_ciclista dc ON ((u.id_usuario = dc.id_usuario)))
  GROUP BY u.id_usuario, u.nombre_completo, u.correo_electronico, u.rol, u.telefono, u.fecha_creacion, u.ultimo_acceso, dc.tipo_bicicleta, dc.nivel_experiencia
  ORDER BY u.fecha_creacion DESC;


ALTER VIEW public.vista_usuarios_activos OWNER TO postgres;

--
-- TOC entry 3542 (class 2604 OID 99017)
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- TOC entry 3545 (class 2604 OID 99028)
-- Name: categorias_evento id_categoria_evento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_evento ALTER COLUMN id_categoria_evento SET DEFAULT nextval('public.categorias_evento_id_categoria_evento_seq'::regclass);


--
-- TOC entry 3533 (class 2604 OID 98982)
-- Name: datos_ciclista id_ciclista; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datos_ciclista ALTER COLUMN id_ciclista SET DEFAULT nextval('public.datos_ciclista_id_ciclista_seq'::regclass);


--
-- TOC entry 3547 (class 2604 OID 99048)
-- Name: equipos id_equipo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos ALTER COLUMN id_equipo SET DEFAULT nextval('public.equipos_id_equipo_seq'::regclass);


--
-- TOC entry 3535 (class 2604 OID 98999)
-- Name: eventos id_evento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id_evento SET DEFAULT nextval('public.eventos_id_evento_seq'::regclass);


--
-- TOC entry 3554 (class 2604 OID 99107)
-- Name: inscripciones id_inscripcion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones ALTER COLUMN id_inscripcion SET DEFAULT nextval('public.inscripciones_id_inscripcion_seq'::regclass);


--
-- TOC entry 3582 (class 2604 OID 123021)
-- Name: integraciones_dispositivos id_integracion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integraciones_dispositivos ALTER COLUMN id_integracion SET DEFAULT nextval('public.integraciones_dispositivos_id_integracion_seq'::regclass);


--
-- TOC entry 3572 (class 2604 OID 122971)
-- Name: invitaciones_amigos id_invitacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitaciones_amigos ALTER COLUMN id_invitacion SET DEFAULT nextval('public.invitaciones_amigos_id_invitacion_seq'::regclass);


--
-- TOC entry 3599 (class 2604 OID 123090)
-- Name: items_pedido id_item; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido ALTER COLUMN id_item SET DEFAULT nextval('public.items_pedido_id_item_seq'::regclass);


--
-- TOC entry 3576 (class 2604 OID 122989)
-- Name: logros_usuarios id_logro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logros_usuarios ALTER COLUMN id_logro SET DEFAULT nextval('public.logros_usuarios_id_logro_seq'::regclass);


--
-- TOC entry 3569 (class 2604 OID 99259)
-- Name: mensajes_contacto id_mensaje; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes_contacto ALTER COLUMN id_mensaje SET DEFAULT nextval('public.mensajes_contacto_id_mensaje_seq'::regclass);


--
-- TOC entry 3579 (class 2604 OID 123005)
-- Name: objetivos_usuarios id_objetivo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objetivos_usuarios ALTER COLUMN id_objetivo SET DEFAULT nextval('public.objetivos_usuarios_id_objetivo_seq'::regclass);


--
-- TOC entry 3558 (class 2604 OID 99142)
-- Name: pagos id_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id_pago SET DEFAULT nextval('public.pagos_id_pago_seq'::regclass);


--
-- TOC entry 3595 (class 2604 OID 123072)
-- Name: pedidos_tienda id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_tienda ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedidos_tienda_id_pedido_seq'::regclass);


--
-- TOC entry 3565 (class 2604 OID 99231)
-- Name: planes_suscripcion id_plan; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planes_suscripcion ALTER COLUMN id_plan SET DEFAULT nextval('public.planes_suscripcion_id_plan_seq'::regclass);


--
-- TOC entry 3591 (class 2604 OID 123060)
-- Name: productos_tienda id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_tienda ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_tienda_id_producto_seq'::regclass);


--
-- TOC entry 3560 (class 2604 OID 99170)
-- Name: puntos_control id_punto_control; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puntos_control ALTER COLUMN id_punto_control SET DEFAULT nextval('public.puntos_control_id_punto_control_seq'::regclass);


--
-- TOC entry 3586 (class 2604 OID 123039)
-- Name: reportes_problemas id_reporte; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reportes_problemas ALTER COLUMN id_reporte SET DEFAULT nextval('public.reportes_problemas_id_reporte_seq'::regclass);


--
-- TOC entry 3562 (class 2604 OID 99199)
-- Name: resultados_carrera id_resultado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_carrera ALTER COLUMN id_resultado SET DEFAULT nextval('public.resultados_carrera_id_resultado_seq'::regclass);


--
-- TOC entry 3563 (class 2604 OID 99213)
-- Name: resultados_evento id_resultado_evento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_evento ALTER COLUMN id_resultado_evento SET DEFAULT nextval('public.resultados_evento_id_resultado_evento_seq'::regclass);


--
-- TOC entry 3559 (class 2604 OID 99158)
-- Name: rutas id_ruta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rutas ALTER COLUMN id_ruta SET DEFAULT nextval('public.rutas_id_ruta_seq'::regclass);


--
-- TOC entry 3600 (class 2604 OID 123116)
-- Name: sectores_ruta id_sector; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores_ruta ALTER COLUMN id_sector SET DEFAULT nextval('public.sectores_ruta_id_sector_seq'::regclass);


--
-- TOC entry 3567 (class 2604 OID 99241)
-- Name: suscripciones_usuario id_suscripcion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscripciones_usuario ALTER COLUMN id_suscripcion SET DEFAULT nextval('public.suscripciones_usuario_id_suscripcion_seq'::regclass);


--
-- TOC entry 3552 (class 2604 OID 99085)
-- Name: tallas_playera id_talla_playera; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas_playera ALTER COLUMN id_talla_playera SET DEFAULT nextval('public.tallas_playera_id_talla_playera_seq'::regclass);


--
-- TOC entry 3553 (class 2604 OID 99094)
-- Name: tallas_playera_evento id_talla_evento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas_playera_evento ALTER COLUMN id_talla_evento SET DEFAULT nextval('public.tallas_playera_evento_id_talla_evento_seq'::regclass);


--
-- TOC entry 3561 (class 2604 OID 99182)
-- Name: tiempos_carrera id_tiempo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiempos_carrera ALTER COLUMN id_tiempo SET DEFAULT nextval('public.tiempos_carrera_id_tiempo_seq'::regclass);


--
-- TOC entry 3522 (class 2604 OID 98967)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 3915 (class 0 OID 99014)
-- Dependencies: 224
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id_categoria, nombre, descripcion, edad_minima, edad_maxima, genero_permitido, nivel, activa, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 3917 (class 0 OID 99025)
-- Dependencies: 226
-- Data for Name: categorias_evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias_evento (id_categoria_evento, id_evento, id_categoria, cuota_categoria, maximo_participantes, id_punto_control_final, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 3911 (class 0 OID 98979)
-- Dependencies: 220
-- Data for Name: datos_ciclista; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.datos_ciclista (id_ciclista, id_usuario, fecha_nacimiento, genero, contacto_emergencia, telefono_emergencia, talla_playera, tipo_bicicleta, nivel_experiencia, alergias, condiciones_medicas, direccion, ciudad, pais, codigo_postal, marca_bicicleta, modelo_bicicleta, ano_bicicleta, talla_bicicleta, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 3919 (class 0 OID 99045)
-- Dependencies: 228
-- Data for Name: equipos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipos (id_equipo, nombre, id_capitan, descripcion, url_imagen, enlace_invitacion, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	MARIO EFRAIN	5	QWERTY	\N	\N	t	2025-10-25 14:44:58.295608-06	2025-10-25 14:44:58.295608-06
4	MARIO EFRAIN1111	14	1234567u	\N	e49be764-920d-4b87-bbb0-1cf8b367fb83	t	2025-10-25 15:45:33.190237-06	2025-10-25 15:45:33.190237-06
2	MARIO EFRAINAAA	6	AAAAAAAAAA	\N	98a67515-db98-44fd-a9ee-450154cd073f	t	2025-10-25 14:51:03.003024-06	2025-10-25 14:51:03.003024-06
5	112345678	6	|12345678	\N	862d4a15-ee4a-4ceb-bff8-18dc972102a0	t	2025-10-25 15:46:00.821491-06	2025-10-25 15:46:00.821491-06
6	Erick Gamaliel	9		\N	efd3c46b-d5c9-4bf0-a5f7-4836265548ef	t	2025-10-25 16:58:11.833871-06	2025-10-25 16:58:11.833871-06
\.


--
-- TOC entry 3913 (class 0 OID 98996)
-- Dependencies: 222
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id_evento, id_organizador, nombre, descripcion, fecha_inicio, fecha_fin, fecha_limite_inscripcion, estado, tipo, ubicacion, distancia_km, elevacion_total, dificultad, cuota_inscripcion, maximo_participantes, maximo_miembros_equipo, permite_union_equipos, url_imagen, coordenadas_ruta, sectores_ruta, instrucciones_especiales, fecha_creacion, id_plantilla, configuracion_ruta, plantilla_personalizada, datos_meteorologicos, es_destacado) FROM stdin;
3	3	prueba	www	2025-10-27 05:57:00-06	2025-10-31 17:57:00-06	\N	proximo	Recreativo	cd mx	222.00	\N	Moderado	22.00	222	\N	t	\N	\N	\N	\N	2025-10-27 12:51:30.942059-06	\N	\N	f	\N	f
4	3	Erick Gamaliel	11111111	2025-10-31 13:42:00-06	2025-11-11 13:42:00-06	\N	proximo	Montaña	cd mx	12.00	\N	Extremo	1112.00	30	\N	t	\N	\N	\N	\N	2025-10-27 13:43:18.213824-06	\N	\N	f	\N	f
5	3	Laptop HP Pavilion	qwertyuioo	2025-10-31 19:01:00-06	2026-01-09 08:02:00-06	\N	proximo	Recreativo	123	22.00	\N	Moderado	123.00	123	\N	t	\N	\N	\N	\N	2025-10-28 14:00:42.612812-06	\N	\N	f	\N	f
6	3	MARIO EFRAIN	123\n456789	2025-10-30 20:25:00-06	2025-12-06 16:22:00-06	\N	proximo	Gravel	cd mx	1234.00	\N	Moderado	125.00	145	\N	t	\N	\N	\N	\N	2025-10-30 01:20:23.615269-06	\N	\N	f	\N	f
\.


--
-- TOC entry 3926 (class 0 OID 99104)
-- Dependencies: 235
-- Data for Name: inscripciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscripciones (id_inscripcion, id_usuario, id_evento, id_categoria, id_talla_playera, id_equipo, numero_dorsal, alias_dorsal, estado, numero_telefono, fecha_nacimiento, genero, nombre_contacto_emergencia, telefono_contacto_emergencia, url_identificacion, tiempo_total, posicion_general, posicion_categoria, distancia_completada, ritmo_promedio, fecha_inscripcion, datos_seguimiento, ultima_actualizacion_gps, modo_emergencia_activado) FROM stdin;
\.


--
-- TOC entry 3952 (class 0 OID 123018)
-- Dependencies: 263
-- Data for Name: integraciones_dispositivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.integraciones_dispositivos (id_integracion, id_usuario, plataforma, token_acceso, token_actualizacion, configuracion, activo, fecha_conexion, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 3946 (class 0 OID 122968)
-- Dependencies: 257
-- Data for Name: invitaciones_amigos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invitaciones_amigos (id_invitacion, id_usuario_invitador, email_invitado, token_invitacion, estado, fecha_invitacion, fecha_aceptacion, recompensa_otorgada) FROM stdin;
\.


--
-- TOC entry 3960 (class 0 OID 123087)
-- Dependencies: 271
-- Data for Name: items_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items_pedido (id_item, id_pedido, id_producto, cantidad, precio_unitario) FROM stdin;
\.


--
-- TOC entry 3948 (class 0 OID 122986)
-- Dependencies: 259
-- Data for Name: logros_usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logros_usuarios (id_logro, id_usuario, tipo_logro, nombre_logro, descripcion, icono, fecha_obtencion, nivel) FROM stdin;
\.


--
-- TOC entry 3944 (class 0 OID 99256)
-- Dependencies: 253
-- Data for Name: mensajes_contacto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mensajes_contacto (id_mensaje, nombre_completo, correo_electronico, telefono, id_evento, motivo, asunto, mensaje, archivo_adjunto, estado, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 3920 (class 0 OID 99065)
-- Dependencies: 229
-- Data for Name: miembros_equipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.miembros_equipo (id_equipo, id_usuario, fecha_union) FROM stdin;
1	5	2025-10-25 14:44:58.295608-06
2	6	2025-10-25 14:51:03.003024-06
4	14	2025-10-25 15:45:33.190237-06
5	6	2025-10-25 15:46:00.821491-06
6	9	2025-10-25 16:58:11.833871-06
\.


--
-- TOC entry 3950 (class 0 OID 123002)
-- Dependencies: 261
-- Data for Name: objetivos_usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.objetivos_usuarios (id_objetivo, id_usuario, tipo_objetivo, descripcion, meta_valor, progreso_actual, fecha_inicio, fecha_objetivo, completado) FROM stdin;
\.


--
-- TOC entry 3928 (class 0 OID 99139)
-- Dependencies: 237
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id_pago, id_inscripcion, fecha_pago, numero_referencia, url_comprobante, estado) FROM stdin;
\.


--
-- TOC entry 3958 (class 0 OID 123069)
-- Dependencies: 269
-- Data for Name: pedidos_tienda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos_tienda (id_pedido, id_usuario, estado, total, direccion_envio, fecha_pedido, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 3940 (class 0 OID 99228)
-- Dependencies: 249
-- Data for Name: planes_suscripcion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planes_suscripcion (id_plan, nombre, precio_mensual, descripcion, caracteristicas, activo) FROM stdin;
\.


--
-- TOC entry 3956 (class 0 OID 123057)
-- Dependencies: 267
-- Data for Name: productos_tienda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos_tienda (id_producto, nombre, descripcion, precio, categoria, imagenes, inventario, activo, fecha_creacion) FROM stdin;
2	Edgar yair	Esta es una playera de efar probando la tienda	123.00	nutricion	\N	122	t	2025-10-27 19:19:36.984038-06
1	MARIO EFRAIN	qwert	134.00	ropa	\N	14	t	2025-10-26 00:05:02.328538-06
\.


--
-- TOC entry 3932 (class 0 OID 99167)
-- Dependencies: 241
-- Data for Name: puntos_control; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.puntos_control (id_punto_control, id_ruta, nombre, orden) FROM stdin;
\.


--
-- TOC entry 3954 (class 0 OID 123036)
-- Dependencies: 265
-- Data for Name: reportes_problemas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reportes_problemas (id_reporte, id_usuario, tipo_reporte, titulo, descripcion, metadatos, archivo_adjunto, estado, prioridad, fecha_creacion, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 3936 (class 0 OID 99196)
-- Dependencies: 245
-- Data for Name: resultados_carrera; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resultados_carrera (id_resultado, id_inscripcion, posicion_general, posicion_categoria, tiempo_total, estado) FROM stdin;
\.


--
-- TOC entry 3938 (class 0 OID 99210)
-- Dependencies: 247
-- Data for Name: resultados_evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resultados_evento (id_resultado_evento, id_evento, id_usuario, posicion, tiempo_total, categoria, distancia_completada, fecha_registro) FROM stdin;
\.


--
-- TOC entry 3930 (class 0 OID 99155)
-- Dependencies: 239
-- Data for Name: rutas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rutas (id_ruta, id_evento, nombre, distancia_km) FROM stdin;
\.


--
-- TOC entry 3962 (class 0 OID 123113)
-- Dependencies: 273
-- Data for Name: sectores_ruta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sectores_ruta (id_sector, id_ruta, nombre, distancia_km, elevacion_ganada, dificultad_sugerida, orden) FROM stdin;
\.


--
-- TOC entry 3942 (class 0 OID 99238)
-- Dependencies: 251
-- Data for Name: suscripciones_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suscripciones_usuario (id_suscripcion, id_usuario, id_plan, fecha_inicio, fecha_fin, activa) FROM stdin;
\.


--
-- TOC entry 3922 (class 0 OID 99082)
-- Dependencies: 231
-- Data for Name: tallas_playera; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tallas_playera (id_talla_playera, nombre, descripcion) FROM stdin;
\.


--
-- TOC entry 3924 (class 0 OID 99091)
-- Dependencies: 233
-- Data for Name: tallas_playera_evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tallas_playera_evento (id_talla_evento, id_evento, nombre_talla, disponibles) FROM stdin;
\.


--
-- TOC entry 3934 (class 0 OID 99179)
-- Dependencies: 243
-- Data for Name: tiempos_carrera; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiempos_carrera (id_tiempo, id_inscripcion, id_punto_control, marca_tiempo) FROM stdin;
\.


--
-- TOC entry 3909 (class 0 OID 98964)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre_completo, correo_electronico, contrasena, rol, telefono, url_imagen_perfil, telefono_verificado, puede_crear_equipo, fecha_verificacion, ultimo_acceso, fecha_creacion, onboarding_completado, intereses, configuracion_notificaciones, tema_preferido, idioma, privacidad_perfil, reset_password_token, reset_password_expires) FROM stdin;
1	Usuario Test	test@ejemplo.com	$2a$10$Zo5oXTwbLHP3Ic8GlOjJkeJxQ7IZnvUOYJbrsu.fpp7.hyuxrmTLe	usuario	\N	\N	f	f	\N	\N	2025-10-18 00:21:11.249-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
2	Josias Martinez de los santos	Josias@gmail.com	$2a$10$m3APy.uumnvbkj0kzbvYxeJde9lOqmhnm7PYV606AnAFC/KiDXela	usuario	\N	\N	f	f	\N	\N	2025-10-18 00:42:15.437-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
4	Organizador de Eventos	organizador@ciclismo.com	$2a$10$r5vXTBIRI.JaDlxALPTy5.5IvWPJuOLiMH9I45zA/R.fA3B.YeCMS	organizador	+34 600 333 444	\N	f	t	\N	\N	2025-10-18 00:47:54.163-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
5	Usuario Regular	usuario@ciclismo.com	$2a$10$0rE9v.D64HGnZZDYtUxEIeY4zyI.FosJCXmnwUUBd7WNGEujM./a2	usuario	+34 600 555 666	\N	f	f	\N	\N	2025-10-18 00:47:54.242-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
6	marioadmin	admin@test.com	$2a$10$g/wpO1MrtlGqAFH.175/pOhy6PDHu7irhBpUwrrN4WSg9jR2HzaQS	usuario	\N	\N	f	f	\N	\N	2025-10-18 17:04:01.302-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
7	Erick Gamaliel	mariomoguel09@gmail.com	$2a$10$BW.DVygEc6wqnv93/7EsheJNJzlkOhZM5FQnQ2bf5eSZTIDhkqRse	usuario	\N	\N	f	f	\N	\N	2025-10-18 17:05:43.062-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
8	Maario Efrain Moguel Hernandez	test@ciclismo.com	$2a$10$nQZNIxMcBiYCLMMyLMW4cu0wVcYVIlZ4dy8sATS3oEfQj0ikl4Rwu	usuario	\N	\N	f	f	\N	\N	2025-10-18 17:06:29.735-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
3	Administrador Principal	admin@ciclismo.com	$2a$10$VnOhPyaHgggjJOubohzRkeYm9YjkOpzFtnSF5Fd4eeO0ki8xkN2qW	administrador	+34 600 111 222	\N	f	t	\N	\N	2025-10-18 00:44:26.599-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
9	MARIO EFRAIN	mariomoguel05@gmail.com	$2a$10$HhApvrBWI2r9oxr5ul/1HuWvzycY1Y.HqIhyRm6rJl.ctHVb77XyK	usuario	\N	\N	f	f	\N	\N	2025-10-21 02:01:24.513-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
10	Edgarn Yahir Altunar Gómez	yahiredgar631@gmail.com	$2a$10$DjYVgCZ.HbM.GxGbYAFjEuYOY1uR5mpkYyUqZueq9vlkT6NyG4d.K	usuario	\N	\N	f	f	\N	\N	2025-10-22 18:33:59.594-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
11	Isaacmolina sanchez	iscac@gamil.com	$2a$10$DDn9ouaWyU3nD4F4OnV0geBTiFXeRLKjDd5wuQOLbzgYkAsCQ2yNe	usuario	\N	\N	f	f	\N	\N	2025-10-22 18:38:03.873-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
12	Usuario de Prueba	prueba@ejemplo.com	$2a$10$hashedpassword	usuario	\N	\N	f	f	\N	\N	2025-10-24 11:19:17.915262-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
14	marioadmin	user@test.com	$2a$10$wUN.WgYVpXNh4FcxOXF2I.FBkKQWlTMem8dZNnQoUovXcIzBvUEtG	usuario	\N	\N	f	f	\N	\N	2025-10-25 15:20:58.999298-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
15	Jobmelet yahisiri	Jobmeletyahisiri@gmail.com	$2a$10$cAP9iOym9TW5fPkqjMV5t.uDVRjXDqAqE4VRcGBmM47cliMzgQ1Ta	usuario	\N	\N	f	f	\N	\N	2025-10-27 01:15:13.6264-06	f	\N	{"push": true, "email": true, "marketing": false}	claro	es	publico	\N	\N
\.


--
-- TOC entry 3995 (class 0 OID 0)
-- Dependencies: 225
-- Name: categorias_evento_id_categoria_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_evento_id_categoria_evento_seq', 1, false);


--
-- TOC entry 3996 (class 0 OID 0)
-- Dependencies: 223
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 1, false);


--
-- TOC entry 3997 (class 0 OID 0)
-- Dependencies: 219
-- Name: datos_ciclista_id_ciclista_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.datos_ciclista_id_ciclista_seq', 1, false);


--
-- TOC entry 3998 (class 0 OID 0)
-- Dependencies: 227
-- Name: equipos_id_equipo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipos_id_equipo_seq', 6, true);


--
-- TOC entry 3999 (class 0 OID 0)
-- Dependencies: 221
-- Name: eventos_id_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_evento_seq', 9, true);


--
-- TOC entry 4000 (class 0 OID 0)
-- Dependencies: 234
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscripciones_id_inscripcion_seq', 1, false);


--
-- TOC entry 4001 (class 0 OID 0)
-- Dependencies: 262
-- Name: integraciones_dispositivos_id_integracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.integraciones_dispositivos_id_integracion_seq', 1, false);


--
-- TOC entry 4002 (class 0 OID 0)
-- Dependencies: 256
-- Name: invitaciones_amigos_id_invitacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invitaciones_amigos_id_invitacion_seq', 1, false);


--
-- TOC entry 4003 (class 0 OID 0)
-- Dependencies: 270
-- Name: items_pedido_id_item_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_pedido_id_item_seq', 1, false);


--
-- TOC entry 4004 (class 0 OID 0)
-- Dependencies: 258
-- Name: logros_usuarios_id_logro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logros_usuarios_id_logro_seq', 1, false);


--
-- TOC entry 4005 (class 0 OID 0)
-- Dependencies: 252
-- Name: mensajes_contacto_id_mensaje_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mensajes_contacto_id_mensaje_seq', 1, false);


--
-- TOC entry 4006 (class 0 OID 0)
-- Dependencies: 260
-- Name: objetivos_usuarios_id_objetivo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.objetivos_usuarios_id_objetivo_seq', 1, false);


--
-- TOC entry 4007 (class 0 OID 0)
-- Dependencies: 236
-- Name: pagos_id_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_pago_seq', 1, false);


--
-- TOC entry 4008 (class 0 OID 0)
-- Dependencies: 268
-- Name: pedidos_tienda_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_tienda_id_pedido_seq', 1, false);


--
-- TOC entry 4009 (class 0 OID 0)
-- Dependencies: 248
-- Name: planes_suscripcion_id_plan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.planes_suscripcion_id_plan_seq', 1, false);


--
-- TOC entry 4010 (class 0 OID 0)
-- Dependencies: 266
-- Name: productos_tienda_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_tienda_id_producto_seq', 2, true);


--
-- TOC entry 4011 (class 0 OID 0)
-- Dependencies: 240
-- Name: puntos_control_id_punto_control_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.puntos_control_id_punto_control_seq', 1, false);


--
-- TOC entry 4012 (class 0 OID 0)
-- Dependencies: 264
-- Name: reportes_problemas_id_reporte_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reportes_problemas_id_reporte_seq', 1, false);


--
-- TOC entry 4013 (class 0 OID 0)
-- Dependencies: 244
-- Name: resultados_carrera_id_resultado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resultados_carrera_id_resultado_seq', 1, false);


--
-- TOC entry 4014 (class 0 OID 0)
-- Dependencies: 246
-- Name: resultados_evento_id_resultado_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resultados_evento_id_resultado_evento_seq', 1, false);


--
-- TOC entry 4015 (class 0 OID 0)
-- Dependencies: 238
-- Name: rutas_id_ruta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rutas_id_ruta_seq', 1, false);


--
-- TOC entry 4016 (class 0 OID 0)
-- Dependencies: 272
-- Name: sectores_ruta_id_sector_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sectores_ruta_id_sector_seq', 1, false);


--
-- TOC entry 4017 (class 0 OID 0)
-- Dependencies: 250
-- Name: suscripciones_usuario_id_suscripcion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suscripciones_usuario_id_suscripcion_seq', 1, false);


--
-- TOC entry 4018 (class 0 OID 0)
-- Dependencies: 232
-- Name: tallas_playera_evento_id_talla_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tallas_playera_evento_id_talla_evento_seq', 1, false);


--
-- TOC entry 4019 (class 0 OID 0)
-- Dependencies: 230
-- Name: tallas_playera_id_talla_playera_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tallas_playera_id_talla_playera_seq', 1, false);


--
-- TOC entry 4020 (class 0 OID 0)
-- Dependencies: 242
-- Name: tiempos_carrera_id_tiempo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiempos_carrera_id_tiempo_seq', 1, false);


--
-- TOC entry 4021 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 15, true);


--
-- TOC entry 3633 (class 2606 OID 99033)
-- Name: categorias_evento categorias_evento_id_evento_id_categoria_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_evento
    ADD CONSTRAINT categorias_evento_id_evento_id_categoria_key UNIQUE (id_evento, id_categoria);


--
-- TOC entry 3635 (class 2606 OID 99031)
-- Name: categorias_evento categorias_evento_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_evento
    ADD CONSTRAINT categorias_evento_pkey1 PRIMARY KEY (id_categoria_evento);


--
-- TOC entry 3631 (class 2606 OID 99023)
-- Name: categorias categorias_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey1 PRIMARY KEY (id_categoria);


--
-- TOC entry 3620 (class 2606 OID 98989)
-- Name: datos_ciclista datos_ciclista_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datos_ciclista
    ADD CONSTRAINT datos_ciclista_id_usuario_key UNIQUE (id_usuario);


--
-- TOC entry 3622 (class 2606 OID 98987)
-- Name: datos_ciclista datos_ciclista_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datos_ciclista
    ADD CONSTRAINT datos_ciclista_pkey1 PRIMARY KEY (id_ciclista);


--
-- TOC entry 3638 (class 2606 OID 99059)
-- Name: equipos equipos_enlace_invitacion_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_enlace_invitacion_key1 UNIQUE (enlace_invitacion);


--
-- TOC entry 3640 (class 2606 OID 99057)
-- Name: equipos equipos_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_nombre_key1 UNIQUE (nombre);


--
-- TOC entry 3642 (class 2606 OID 99055)
-- Name: equipos equipos_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_pkey1 PRIMARY KEY (id_equipo);


--
-- TOC entry 3625 (class 2606 OID 99007)
-- Name: eventos eventos_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey1 PRIMARY KEY (id_evento);


--
-- TOC entry 3657 (class 2606 OID 99117)
-- Name: inscripciones inscripciones_id_evento_alias_dorsal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_evento_alias_dorsal_key UNIQUE (id_evento, alias_dorsal);


--
-- TOC entry 3659 (class 2606 OID 99115)
-- Name: inscripciones inscripciones_id_evento_numero_dorsal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_evento_numero_dorsal_key UNIQUE (id_evento, numero_dorsal);


--
-- TOC entry 3661 (class 2606 OID 99113)
-- Name: inscripciones inscripciones_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_pkey1 PRIMARY KEY (id_inscripcion);


--
-- TOC entry 3696 (class 2606 OID 123029)
-- Name: integraciones_dispositivos integraciones_dispositivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integraciones_dispositivos
    ADD CONSTRAINT integraciones_dispositivos_pkey PRIMARY KEY (id_integracion);


--
-- TOC entry 3687 (class 2606 OID 122977)
-- Name: invitaciones_amigos invitaciones_amigos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitaciones_amigos
    ADD CONSTRAINT invitaciones_amigos_pkey PRIMARY KEY (id_invitacion);


--
-- TOC entry 3689 (class 2606 OID 122979)
-- Name: invitaciones_amigos invitaciones_amigos_token_invitacion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitaciones_amigos
    ADD CONSTRAINT invitaciones_amigos_token_invitacion_key UNIQUE (token_invitacion);


--
-- TOC entry 3706 (class 2606 OID 123092)
-- Name: items_pedido items_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido
    ADD CONSTRAINT items_pedido_pkey PRIMARY KEY (id_item);


--
-- TOC entry 3691 (class 2606 OID 122995)
-- Name: logros_usuarios logros_usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logros_usuarios
    ADD CONSTRAINT logros_usuarios_pkey PRIMARY KEY (id_logro);


--
-- TOC entry 3684 (class 2606 OID 99265)
-- Name: mensajes_contacto mensajes_contacto_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes_contacto
    ADD CONSTRAINT mensajes_contacto_pkey1 PRIMARY KEY (id_mensaje);


--
-- TOC entry 3645 (class 2606 OID 99070)
-- Name: miembros_equipo miembros_equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros_equipo
    ADD CONSTRAINT miembros_equipo_pkey PRIMARY KEY (id_equipo, id_usuario);


--
-- TOC entry 3693 (class 2606 OID 123011)
-- Name: objetivos_usuarios objetivos_usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objetivos_usuarios
    ADD CONSTRAINT objetivos_usuarios_pkey PRIMARY KEY (id_objetivo);


--
-- TOC entry 3663 (class 2606 OID 99148)
-- Name: pagos pagos_id_inscripcion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_id_inscripcion_key UNIQUE (id_inscripcion);


--
-- TOC entry 3665 (class 2606 OID 99146)
-- Name: pagos pagos_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey1 PRIMARY KEY (id_pago);


--
-- TOC entry 3704 (class 2606 OID 123080)
-- Name: pedidos_tienda pedidos_tienda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_tienda
    ADD CONSTRAINT pedidos_tienda_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 3680 (class 2606 OID 99236)
-- Name: planes_suscripcion planes_suscripcion_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planes_suscripcion
    ADD CONSTRAINT planes_suscripcion_pkey1 PRIMARY KEY (id_plan);


--
-- TOC entry 3701 (class 2606 OID 123067)
-- Name: productos_tienda productos_tienda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_tienda
    ADD CONSTRAINT productos_tienda_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 3669 (class 2606 OID 99172)
-- Name: puntos_control puntos_control_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puntos_control
    ADD CONSTRAINT puntos_control_pkey PRIMARY KEY (id_punto_control);


--
-- TOC entry 3699 (class 2606 OID 123050)
-- Name: reportes_problemas reportes_problemas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reportes_problemas
    ADD CONSTRAINT reportes_problemas_pkey PRIMARY KEY (id_reporte);


--
-- TOC entry 3673 (class 2606 OID 99203)
-- Name: resultados_carrera resultados_carrera_id_inscripcion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_carrera
    ADD CONSTRAINT resultados_carrera_id_inscripcion_key UNIQUE (id_inscripcion);


--
-- TOC entry 3675 (class 2606 OID 99201)
-- Name: resultados_carrera resultados_carrera_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_carrera
    ADD CONSTRAINT resultados_carrera_pkey1 PRIMARY KEY (id_resultado);


--
-- TOC entry 3678 (class 2606 OID 99216)
-- Name: resultados_evento resultados_evento_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_evento
    ADD CONSTRAINT resultados_evento_pkey1 PRIMARY KEY (id_resultado_evento);


--
-- TOC entry 3667 (class 2606 OID 99160)
-- Name: rutas rutas_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rutas
    ADD CONSTRAINT rutas_pkey1 PRIMARY KEY (id_ruta);


--
-- TOC entry 3708 (class 2606 OID 123118)
-- Name: sectores_ruta sectores_ruta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores_ruta
    ADD CONSTRAINT sectores_ruta_pkey PRIMARY KEY (id_sector);


--
-- TOC entry 3682 (class 2606 OID 99244)
-- Name: suscripciones_usuario suscripciones_usuario_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscripciones_usuario
    ADD CONSTRAINT suscripciones_usuario_pkey1 PRIMARY KEY (id_suscripcion);


--
-- TOC entry 3651 (class 2606 OID 99097)
-- Name: tallas_playera_evento tallas_playera_evento_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas_playera_evento
    ADD CONSTRAINT tallas_playera_evento_pkey1 PRIMARY KEY (id_talla_evento);


--
-- TOC entry 3647 (class 2606 OID 99089)
-- Name: tallas_playera tallas_playera_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas_playera
    ADD CONSTRAINT tallas_playera_nombre_key1 UNIQUE (nombre);


--
-- TOC entry 3649 (class 2606 OID 99087)
-- Name: tallas_playera tallas_playera_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas_playera
    ADD CONSTRAINT tallas_playera_pkey1 PRIMARY KEY (id_talla_playera);


--
-- TOC entry 3671 (class 2606 OID 99184)
-- Name: tiempos_carrera tiempos_carrera_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiempos_carrera
    ADD CONSTRAINT tiempos_carrera_pkey1 PRIMARY KEY (id_tiempo);


--
-- TOC entry 3616 (class 2606 OID 98977)
-- Name: usuarios usuarios_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_electronico_key UNIQUE (correo_electronico);


--
-- TOC entry 3618 (class 2606 OID 98975)
-- Name: usuarios usuarios_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey1 PRIMARY KEY (id_usuario);


--
-- TOC entry 3636 (class 1259 OID 99282)
-- Name: idx_categorias_evento_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_categorias_evento_evento ON public.categorias_evento USING btree (id_evento);


--
-- TOC entry 3623 (class 1259 OID 99281)
-- Name: idx_datos_ciclista_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_datos_ciclista_usuario ON public.datos_ciclista USING btree (id_usuario);


--
-- TOC entry 3643 (class 1259 OID 99280)
-- Name: idx_equipos_capitan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_equipos_capitan ON public.equipos USING btree (id_capitan);


--
-- TOC entry 3626 (class 1259 OID 99273)
-- Name: idx_eventos_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eventos_estado ON public.eventos USING btree (estado);


--
-- TOC entry 3627 (class 1259 OID 99274)
-- Name: idx_eventos_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eventos_fecha ON public.eventos USING btree (fecha_inicio);


--
-- TOC entry 3628 (class 1259 OID 99275)
-- Name: idx_eventos_organizador; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eventos_organizador ON public.eventos USING btree (id_organizador);


--
-- TOC entry 3629 (class 1259 OID 123125)
-- Name: idx_eventos_plantilla; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eventos_plantilla ON public.eventos USING btree (id_plantilla);


--
-- TOC entry 3652 (class 1259 OID 99276)
-- Name: idx_inscripciones_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_estado ON public.inscripciones USING btree (estado);


--
-- TOC entry 3653 (class 1259 OID 99277)
-- Name: idx_inscripciones_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_evento ON public.inscripciones USING btree (id_evento);


--
-- TOC entry 3654 (class 1259 OID 99278)
-- Name: idx_inscripciones_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_usuario ON public.inscripciones USING btree (id_usuario);


--
-- TOC entry 3655 (class 1259 OID 99279)
-- Name: idx_inscripciones_usuario_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_usuario_evento ON public.inscripciones USING btree (id_usuario, id_evento);


--
-- TOC entry 3694 (class 1259 OID 123127)
-- Name: idx_integraciones_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_integraciones_usuario ON public.integraciones_dispositivos USING btree (id_usuario, plataforma);


--
-- TOC entry 3685 (class 1259 OID 123126)
-- Name: idx_invitaciones_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invitaciones_token ON public.invitaciones_amigos USING btree (token_invitacion);


--
-- TOC entry 3702 (class 1259 OID 123129)
-- Name: idx_pedidos_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pedidos_estado ON public.pedidos_tienda USING btree (estado);


--
-- TOC entry 3697 (class 1259 OID 123128)
-- Name: idx_reportes_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reportes_estado ON public.reportes_problemas USING btree (estado, prioridad);


--
-- TOC entry 3676 (class 1259 OID 99283)
-- Name: idx_resultados_evento_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_resultados_evento_usuario ON public.resultados_evento USING btree (id_evento, id_usuario);


--
-- TOC entry 3612 (class 1259 OID 99271)
-- Name: idx_usuarios_correo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_correo ON public.usuarios USING btree (correo_electronico);


--
-- TOC entry 3613 (class 1259 OID 123124)
-- Name: idx_usuarios_onboarding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_onboarding ON public.usuarios USING btree (onboarding_completado);


--
-- TOC entry 3614 (class 1259 OID 99272)
-- Name: idx_usuarios_rol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_rol ON public.usuarios USING btree (rol);


--
-- TOC entry 3742 (class 2620 OID 123134)
-- Name: eventos trigger_actualizar_eventos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_actualizar_eventos BEFORE UPDATE ON public.eventos FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 3741 (class 2620 OID 123133)
-- Name: usuarios trigger_actualizar_usuarios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_actualizar_usuarios BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 3711 (class 2606 OID 99039)
-- Name: categorias_evento categorias_evento_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_evento
    ADD CONSTRAINT categorias_evento_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria) ON DELETE CASCADE;


--
-- TOC entry 3712 (class 2606 OID 99034)
-- Name: categorias_evento categorias_evento_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_evento
    ADD CONSTRAINT categorias_evento_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento) ON DELETE CASCADE;


--
-- TOC entry 3709 (class 2606 OID 98990)
-- Name: datos_ciclista datos_ciclista_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datos_ciclista
    ADD CONSTRAINT datos_ciclista_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 3713 (class 2606 OID 99060)
-- Name: equipos equipos_id_capitan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_id_capitan_fkey FOREIGN KEY (id_capitan) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3710 (class 2606 OID 99008)
-- Name: eventos eventos_id_organizador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_id_organizador_fkey FOREIGN KEY (id_organizador) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3717 (class 2606 OID 99133)
-- Name: inscripciones inscripciones_id_equipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipos(id_equipo);


--
-- TOC entry 3718 (class 2606 OID 99123)
-- Name: inscripciones inscripciones_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento);


--
-- TOC entry 3719 (class 2606 OID 99128)
-- Name: inscripciones inscripciones_id_talla_playera_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_talla_playera_fkey FOREIGN KEY (id_talla_playera) REFERENCES public.tallas_playera(id_talla_playera);


--
-- TOC entry 3720 (class 2606 OID 99118)
-- Name: inscripciones inscripciones_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3735 (class 2606 OID 123030)
-- Name: integraciones_dispositivos integraciones_dispositivos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integraciones_dispositivos
    ADD CONSTRAINT integraciones_dispositivos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3732 (class 2606 OID 122980)
-- Name: invitaciones_amigos invitaciones_amigos_id_usuario_invitador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitaciones_amigos
    ADD CONSTRAINT invitaciones_amigos_id_usuario_invitador_fkey FOREIGN KEY (id_usuario_invitador) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3738 (class 2606 OID 123093)
-- Name: items_pedido items_pedido_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido
    ADD CONSTRAINT items_pedido_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedidos_tienda(id_pedido);


--
-- TOC entry 3739 (class 2606 OID 123098)
-- Name: items_pedido items_pedido_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido
    ADD CONSTRAINT items_pedido_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos_tienda(id_producto);


--
-- TOC entry 3733 (class 2606 OID 122996)
-- Name: logros_usuarios logros_usuarios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logros_usuarios
    ADD CONSTRAINT logros_usuarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3731 (class 2606 OID 99266)
-- Name: mensajes_contacto mensajes_contacto_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes_contacto
    ADD CONSTRAINT mensajes_contacto_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento);


--
-- TOC entry 3714 (class 2606 OID 99071)
-- Name: miembros_equipo miembros_equipo_id_equipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros_equipo
    ADD CONSTRAINT miembros_equipo_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipos(id_equipo);


--
-- TOC entry 3715 (class 2606 OID 99076)
-- Name: miembros_equipo miembros_equipo_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros_equipo
    ADD CONSTRAINT miembros_equipo_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3734 (class 2606 OID 123012)
-- Name: objetivos_usuarios objetivos_usuarios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objetivos_usuarios
    ADD CONSTRAINT objetivos_usuarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3721 (class 2606 OID 99149)
-- Name: pagos pagos_id_inscripcion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_id_inscripcion_fkey FOREIGN KEY (id_inscripcion) REFERENCES public.inscripciones(id_inscripcion);


--
-- TOC entry 3737 (class 2606 OID 123081)
-- Name: pedidos_tienda pedidos_tienda_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_tienda
    ADD CONSTRAINT pedidos_tienda_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3723 (class 2606 OID 99173)
-- Name: puntos_control puntos_control_id_ruta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puntos_control
    ADD CONSTRAINT puntos_control_id_ruta_fkey FOREIGN KEY (id_ruta) REFERENCES public.rutas(id_ruta);


--
-- TOC entry 3736 (class 2606 OID 123051)
-- Name: reportes_problemas reportes_problemas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reportes_problemas
    ADD CONSTRAINT reportes_problemas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3726 (class 2606 OID 99204)
-- Name: resultados_carrera resultados_carrera_id_inscripcion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_carrera
    ADD CONSTRAINT resultados_carrera_id_inscripcion_fkey FOREIGN KEY (id_inscripcion) REFERENCES public.inscripciones(id_inscripcion);


--
-- TOC entry 3727 (class 2606 OID 99217)
-- Name: resultados_evento resultados_evento_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_evento
    ADD CONSTRAINT resultados_evento_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento);


--
-- TOC entry 3728 (class 2606 OID 99222)
-- Name: resultados_evento resultados_evento_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_evento
    ADD CONSTRAINT resultados_evento_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3722 (class 2606 OID 99161)
-- Name: rutas rutas_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rutas
    ADD CONSTRAINT rutas_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento);


--
-- TOC entry 3740 (class 2606 OID 123119)
-- Name: sectores_ruta sectores_ruta_id_ruta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores_ruta
    ADD CONSTRAINT sectores_ruta_id_ruta_fkey FOREIGN KEY (id_ruta) REFERENCES public.rutas(id_ruta);


--
-- TOC entry 3729 (class 2606 OID 99250)
-- Name: suscripciones_usuario suscripciones_usuario_id_plan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscripciones_usuario
    ADD CONSTRAINT suscripciones_usuario_id_plan_fkey FOREIGN KEY (id_plan) REFERENCES public.planes_suscripcion(id_plan);


--
-- TOC entry 3730 (class 2606 OID 99245)
-- Name: suscripciones_usuario suscripciones_usuario_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscripciones_usuario
    ADD CONSTRAINT suscripciones_usuario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 3716 (class 2606 OID 99098)
-- Name: tallas_playera_evento tallas_playera_evento_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas_playera_evento
    ADD CONSTRAINT tallas_playera_evento_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento);


--
-- TOC entry 3724 (class 2606 OID 99185)
-- Name: tiempos_carrera tiempos_carrera_id_inscripcion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiempos_carrera
    ADD CONSTRAINT tiempos_carrera_id_inscripcion_fkey FOREIGN KEY (id_inscripcion) REFERENCES public.inscripciones(id_inscripcion);


--
-- TOC entry 3725 (class 2606 OID 99190)
-- Name: tiempos_carrera tiempos_carrera_id_punto_control_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiempos_carrera
    ADD CONSTRAINT tiempos_carrera_id_punto_control_fkey FOREIGN KEY (id_punto_control) REFERENCES public.puntos_control(id_punto_control);


-- Completed on 2025-11-02 13:42:00

--
-- PostgreSQL database dump complete
--

