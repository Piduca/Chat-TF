PGDMP  '                    }            Chat    17.4    17.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    41119    Chat    DATABASE     l   CREATE DATABASE "Chat" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'pt-PT';
    DROP DATABASE "Chat";
                     postgres    false            �            1259    41127    sala    TABLE     �   CREATE TABLE public.sala (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    senha character varying(100) NOT NULL
);
    DROP TABLE public.sala;
       public         heap r       postgres    false            �            1259    41126    sala_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sala_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.sala_id_seq;
       public               postgres    false    218            �           0    0    sala_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.sala_id_seq OWNED BY public.sala.id;
          public               postgres    false    217            W           2604    41130    sala id    DEFAULT     b   ALTER TABLE ONLY public.sala ALTER COLUMN id SET DEFAULT nextval('public.sala_id_seq'::regclass);
 6   ALTER TABLE public.sala ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            �          0    41127    sala 
   TABLE DATA           /   COPY public.sala (id, nome, senha) FROM stdin;
    public               postgres    false    218   o       �           0    0    sala_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.sala_id_seq', 3, true);
          public               postgres    false    217            Y           2606    41134    sala sala_nome_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_nome_key UNIQUE (nome);
 <   ALTER TABLE ONLY public.sala DROP CONSTRAINT sala_nome_key;
       public                 postgres    false    218            [           2606    41132    sala sala_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.sala DROP CONSTRAINT sala_pkey;
       public                 postgres    false    218            �   0   x�3�N�ITp�,.)�L*�LI�4426�2Bχ�sc����� �l     