import type { FastifyRequest, FastifyReply } from 'fastify';
import { AudioArtistModel } from '../models/AudioArtist';
import { AudioModel } from '../models/Audio';
import uploadHandler from '../lib/uploadHandler';

const readArtistMultipart = async (request: FastifyRequest) => {
  const parts = request.parts();
  const data: any = {};

  for await (const part of parts) {
    if (part.type === 'field') {
      if (part.fieldname === 'name') data.name = part.value;
      if (part.fieldname === 'bio') data.bio = part.value;
      if (part.fieldname === 'genre') data.genre = part.value;
      if (part.fieldname === 'country') data.country = part.value;
      if (part.fieldname === 'status') data.status = part.value === 'true';
      if (part.fieldname === 'image') data.image = part.value;
      if (part.fieldname === 'coverImage') data.coverImage = part.value;
    } else if (part.type === 'file') {
      if (part.fieldname === 'imageFile') {
        const uploadedFile = await uploadHandler.saveFileFromPart(part, request, 'ARTIST');
        data.image = uploadedFile.filePath;
      } else if (part.fieldname === 'coverImageFile') {
        const uploadedFile = await uploadHandler.saveFileFromPart(part, request, 'ARTIST');
        data.coverImage = uploadedFile.filePath;
      }
    }
  }

  return data;
};

export const listAudioArtists = async (request: FastifyRequest, reply: FastifyReply) => {
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

    const [artists, total] = await Promise.all([
      AudioArtistModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AudioArtistModel.countDocuments(filter),
    ]);

    const artistIds = artists.map((a: any) => a._id);
    const trackCounts = await AudioModel.aggregate([
      { $match: { artistId: { $in: artistIds } } },
      { $group: { _id: '$artistId', count: { $sum: 1 } } },
    ]);
    const trackCountMap = new Map(trackCounts.map((t: any) => [t._id.toString(), t.count]));

    return reply.send({
      success: true,
      data: artists.map((artist: any) => ({
        id: artist._id,
        name: artist.name,
        image: artist.image,
        coverImage: artist.coverImage,
        bio: artist.bio,
        genre: artist.genre,
        country: artist.country,
        status: artist.status,
        totalTracks: trackCountMap.get(artist._id.toString()) || 0,
        totalAlbums: 0,
        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt,
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

export const getAudioArtistById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { artistId } = request.params as { artistId: string };
    const artist = await AudioArtistModel.findById(artistId).lean();

    if (!artist) {
      return reply.status(404).send({ success: false, error: 'Artist not found' });
    }

    const trackCount = await AudioModel.countDocuments({ artistId: artist._id });

    return reply.send({
      success: true,
      data: {
        id: artist._id,
        name: artist.name,
        image: artist.image,
        coverImage: artist.coverImage,
        bio: artist.bio,
        genre: artist.genre,
        country: artist.country,
        status: artist.status,
        totalTracks: trackCount,
        totalAlbums: 0,
        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const createAudioArtist = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = await readArtistMultipart(request);

    if (!data.name) {
      return reply.status(400).send({ success: false, error: 'Artist name is required' });
    }

    const artist = await AudioArtistModel.create({
      name: data.name,
      image: data.image,
      coverImage: data.coverImage,
      bio: data.bio,
      genre: data.genre,
      country: data.country,
      status: data.status !== undefined ? data.status : true,
    });

    return reply.status(201).send({
      success: true,
      data: {
        id: artist._id,
        name: artist.name,
        image: artist.image,
        coverImage: artist.coverImage,
        bio: artist.bio,
        genre: artist.genre,
        country: artist.country,
        status: artist.status,
        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const updateAudioArtist = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { artistId } = request.params as { artistId: string };
    const data = await readArtistMultipart(request);

    const existingArtist = await AudioArtistModel.findById(artistId);
    if (!existingArtist) {
      return reply.status(404).send({ success: false, error: 'Artist not found' });
    }

    if (data.image && existingArtist.image) {
      uploadHandler.deleteUploadedFile(existingArtist.image);
    }
    if (data.coverImage && existingArtist.coverImage) {
      uploadHandler.deleteUploadedFile(existingArtist.coverImage);
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.genre !== undefined) updateData.genre = data.genre;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.image) updateData.image = data.image;
    if (data.coverImage) updateData.coverImage = data.coverImage;
    if (data.status !== undefined) updateData.status = data.status;

    const artist = await AudioArtistModel.findByIdAndUpdate(
      artistId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    return reply.send({
      success: true,
      data: {
        id: artist._id,
        name: artist.name,
        image: artist.image,
        coverImage: artist.coverImage,
        bio: artist.bio,
        genre: artist.genre,
        country: artist.country,
        status: artist.status,
        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const deleteAudioArtist = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { artistId } = request.params as { artistId: string };
    const artist = await AudioArtistModel.findByIdAndDelete(artistId);

    if (!artist) {
      return reply.status(404).send({ success: false, error: 'Artist not found' });
    }

    if (artist.image) {
      uploadHandler.deleteUploadedFile(artist.image);
    }
    if (artist.coverImage) {
      uploadHandler.deleteUploadedFile(artist.coverImage);
    }

    return reply.send({
      success: true,
      message: 'Artist deleted successfully',
    });
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const bulkDeleteAudioArtists = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { ids } = request.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return reply.status(400).send({ success: false, message: 'Invalid or empty ids array' });
    }

    const artists = await AudioArtistModel.find({ _id: { $in: ids } });
    
    artists.forEach(artist => {
      if (artist.image) uploadHandler.deleteUploadedFile(artist.image);
      if (artist.coverImage) uploadHandler.deleteUploadedFile(artist.coverImage);
    });

    const result = await AudioArtistModel.deleteMany({ _id: { $in: ids } });

    return {
      success: true,
      message: `${result.deletedCount} artists deleted successfully`,
      deletedCount: result.deletedCount,
    };
  } catch (error: any) {
    console.error('Error bulk deleting artists:', error);
    return reply.status(500).send({ success: false, message: 'Internal server error', error: error.message });
  }
};
