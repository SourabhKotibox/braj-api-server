import type { FastifyRequest, FastifyReply } from 'fastify';
import { AudioAlbumModel } from '../models/AudioAlbum';
import { AudioArtistModel } from '../models/AudioArtist';
import { AudioModel } from '../models/Audio';
import uploadHandler from '../lib/uploadHandler';

const readAlbumMultipart = async (request: FastifyRequest) => {
  const parts = request.parts();
  const data: any = {};

  for await (const part of parts) {
    if (part.type === 'field') {
      if (part.fieldname === 'name') data.name = part.value;
      if (part.fieldname === 'artist') data.artist = part.value;
      if (part.fieldname === 'artistId') data.artistId = part.value;
      if (part.fieldname === 'genre') data.genre = part.value;
      if (part.fieldname === 'description') data.description = part.value;
      if (part.fieldname === 'releaseDate') data.releaseDate = part.value;
      if (part.fieldname === 'status') data.status = part.value === 'true';
      if (part.fieldname === 'image') data.image = part.value;
      if (part.fieldname === 'coverImage') data.coverImage = part.value;
      if (part.fieldname === 'songs') {
        try {
          data.songs = JSON.parse(part.value);
        } catch {
          data.songs = [];
        }
      }
    } else if (part.type === 'file') {
      if (part.fieldname === 'imageFile') {
        const uploadedFile = await uploadHandler.saveFileFromPart(part, request, 'ALBUM');
        data.image = uploadedFile.filePath;
      } else if (part.fieldname === 'coverImageFile') {
        const uploadedFile = await uploadHandler.saveFileFromPart(part, request, 'ALBUM');
        data.coverImage = uploadedFile.filePath;
      }
    }
  }

  return data;
};

export const listAudioAlbums = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const query = request.query as {
      page?: string;
      limit?: string;
      search?: string;
    };
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const search = query.search || '';

    const filter: any = {};
    if (search) {
      filter.name = new RegExp(search, 'i');
    }

    const [albums, total] = await Promise.all([
      AudioAlbumModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AudioAlbumModel.countDocuments(filter),
    ]);

    return reply.send({
      success: true,
      data: albums.map((album: any) => ({
        id: album._id,
        name: album.name,
        artist: album.artist,
        artistId: album.artistId,
        image: album.image,
        coverImage: album.coverImage,
        description: album.description,
        genre: album.genre,
        releaseDate: album.releaseDate,
        totalTracks: album.songs ? album.songs.length : 0,
        status: album.status,
        createdAt: album.createdAt,
        updatedAt: album.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getAudioAlbumById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { albumId } = request.params as { albumId: string };
    const album = await AudioAlbumModel.findById(albumId).lean();

    if (!album) {
      return reply.status(404).send({ success: false, error: 'Album not found' });
    }

    return reply.send({
      success: true,
      data: {
        id: album._id,
        name: album.name,
        artist: album.artist,
        artistId: album.artistId,
        image: album.image,
        coverImage: album.coverImage,
        description: album.description,
        genre: album.genre,
        releaseDate: album.releaseDate,
        songs: album.songs || [],
        totalTracks: album.songs ? album.songs.length : 0,
        status: album.status,
        createdAt: album.createdAt,
        updatedAt: album.updatedAt,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const createAudioAlbum = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = await readAlbumMultipart(request);

    if (!data.name) {
      return reply.status(400).send({ success: false, error: 'Album name is required' });
    }

    const album = await AudioAlbumModel.create({
      name: data.name,
      artist: data.artist,
      artistId: data.artistId,
      image: data.image,
      coverImage: data.coverImage,
      description: data.description,
      genre: data.genre,
      releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
      songs: data.songs || [],
      status: data.status !== undefined ? data.status : true,
    });

    return reply.status(201).send({
      success: true,
      data: {
        id: album._id,
        name: album.name,
        artist: album.artist,
        artistId: album.artistId,
        image: album.image,
        coverImage: album.coverImage,
        description: album.description,
        genre: album.genre,
        releaseDate: album.releaseDate,
        songs: album.songs,
        status: album.status,
        createdAt: album.createdAt,
        updatedAt: album.updatedAt,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const updateAudioAlbum = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { albumId } = request.params as { albumId: string };
    const data = await readAlbumMultipart(request);

    const existingAlbum = await AudioAlbumModel.findById(albumId);
    if (!existingAlbum) {
      return reply.status(404).send({ success: false, error: 'Album not found' });
    }

    if (data.image && existingAlbum.image) {
      uploadHandler.deleteUploadedFile(existingAlbum.image);
    }
    if (data.coverImage && existingAlbum.coverImage) {
      uploadHandler.deleteUploadedFile(existingAlbum.coverImage);
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.artist !== undefined) updateData.artist = data.artist;
    if (data.artistId !== undefined) updateData.artistId = data.artistId;
    if (data.genre !== undefined) updateData.genre = data.genre;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image) updateData.image = data.image;
    if (data.coverImage) updateData.coverImage = data.coverImage;
    if (data.releaseDate) updateData.releaseDate = new Date(data.releaseDate);
    if (data.songs) updateData.songs = data.songs;
    if (data.status !== undefined) updateData.status = data.status;

    const album = await AudioAlbumModel.findByIdAndUpdate(
      albumId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    return reply.send({
      success: true,
      data: {
        id: album._id,
        name: album.name,
        artist: album.artist,
        artistId: album.artistId,
        image: album.image,
        coverImage: album.coverImage,
        description: album.description,
        genre: album.genre,
        releaseDate: album.releaseDate,
        songs: album.songs || [],
        status: album.status,
        createdAt: album.createdAt,
        updatedAt: album.updatedAt,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const deleteAudioAlbum = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { albumId } = request.params as { albumId: string };
    const album = await AudioAlbumModel.findByIdAndDelete(albumId);

    if (!album) {
      return reply.status(404).send({ success: false, error: 'Album not found' });
    }

    if (album.image) {
      uploadHandler.deleteUploadedFile(album.image);
    }
    if (album.coverImage) {
      uploadHandler.deleteUploadedFile(album.coverImage);
    }

    return reply.send({
      success: true,
      message: 'Album deleted successfully',
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const bulkDeleteAudioAlbums = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { ids } = request.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return reply.status(400).send({ success: false, message: 'Invalid or empty ids array' });
    }

    const albums = await AudioAlbumModel.find({ _id: { $in: ids } });
    
    albums.forEach(album => {
      if (album.image) uploadHandler.deleteUploadedFile(album.image);
      if (album.coverImage) uploadHandler.deleteUploadedFile(album.coverImage);
    });

    const result = await AudioAlbumModel.deleteMany({ _id: { $in: ids } });

    return {
      success: true,
      message: `${result.deletedCount} albums deleted successfully`,
      deletedCount: result.deletedCount,
    };
  } catch (error: any) {
    console.error('Error bulk deleting albums:', error);
    return reply.status(500).send({ success: false, message: 'Internal server error', error: error.message });
  }
};
