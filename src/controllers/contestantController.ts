import type { FastifyRequest, FastifyReply } from 'fastify';
import { ContestantModel } from '../models/Contestant';
import { ContestVoteModel } from '../models/ContestVote';
import { ContestVideoModel } from '../models/ContestVideo';
import { logger } from '../lib/logger';

export const getAllContestants = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const query = request.query as { contestVideoId?: string; search?: string };

    const filter: any = {};
    if (query.contestVideoId) filter.contestVideoId = query.contestVideoId;
    if (query.search) {
      filter.$or = [
        { name: new RegExp(query.search, 'i') },
        { email: new RegExp(query.search, 'i') },
      ];
    }

    const contestants = await ContestantModel.find(filter)
      .populate('userId', 'name email')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      data: contestants.map((c: any) => ({ ...c, id: c._id?.toString() })),
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting all contestants');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getContestantById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const contestant = await ContestantModel.findById(id)
      .populate('userId', 'name email')
      .lean();

    if (!contestant) {
      return reply.status(404).send({ success: false, error: 'Contestant not found' });
    }

    return reply.send({ success: true, data: { ...contestant, id: contestant._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error getting contestant by ID');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const createContestant = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = request.body as any;

    if (!body.contestVideoId || !body.name) {
      return reply.status(400).send({ success: false, error: 'contestVideoId and name are required' });
    }

    const video = await ContestVideoModel.findById(body.contestVideoId).lean();
    if (!video) {
      return reply.status(404).send({ success: false, error: 'Contest video not found' });
    }

    const count = await ContestantModel.countDocuments({ contestVideoId: body.contestVideoId });
    if (video.maxContestants && count >= video.maxContestants) {
      return reply.status(400).send({ success: false, error: 'Maximum contestants reached' });
    }

    const last = await ContestantModel.findOne({ contestVideoId: body.contestVideoId }).sort({ order: -1 }).lean();
    body.order = last ? last.order + 1 : 0;

    const contestant = await ContestantModel.create(body);

    await ContestVideoModel.findByIdAndUpdate(body.contestVideoId, { $inc: { totalParticipants: 1 } });

    return reply.status(201).send({
      success: true,
      data: { ...contestant.toObject(), id: contestant._id?.toString() },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error creating contestant');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const updateContestant = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    const contestant = await ContestantModel.findByIdAndUpdate(id, { $set: body }, { returnDocument: 'after', runValidators: true });

    if (!contestant) {
      return reply.status(404).send({ success: false, error: 'Contestant not found' });
    }

    return reply.send({ success: true, data: { ...contestant.toObject(), id: contestant._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error updating contestant');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const deleteContestant = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const contestant = await ContestantModel.findById(id).lean();

    if (!contestant) {
      return reply.status(404).send({ success: false, error: 'Contestant not found' });
    }

    await ContestantModel.findByIdAndDelete(id);
    await ContestVideoModel.findByIdAndUpdate(contestant.contestVideoId, { $inc: { totalParticipants: -1 } });

    return reply.send({ success: true, message: 'Contestant deleted successfully' });
  } catch (error: any) {
    logger.error({ error }, 'Error deleting contestant');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getPublicContestants = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { contestVideoId } = request.params as { contestVideoId: string };

    const video = await ContestVideoModel.findById(contestVideoId).lean();
    if (!video || video.status !== 'published') {
      return reply.status(404).send({ success: false, error: 'Contest not found' });
    }

    const contestants = await ContestantModel.find({ contestVideoId, isActive: true })
      .sort({ order: 1, votes: -1 })
      .lean();

    return reply.send({
      success: true,
      data: contestants.map((c: any) => ({ ...c, id: c._id?.toString() })),
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting public contestants');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const voteContestant = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { contestantId } = request.params as { contestantId: string };
    const contestant = await ContestantModel.findById(contestantId).lean();

    if (!contestant) {
      return reply.status(404).send({ success: false, error: 'Contestant not found' });
    }

    const video = await ContestVideoModel.findById(contestant.contestVideoId).lean();
    if (!video || video.status !== 'published') {
      return reply.status(404).send({ success: false, error: 'Contest not found' });
    }

    if (!video.votingEnabled) {
      return reply.status(400).send({ success: false, error: 'Voting is disabled for this contest' });
    }

    if (video.votingEndDate && new Date() > new Date(video.votingEndDate)) {
      return reply.status(400).send({ success: false, error: 'Voting has ended' });
    }

    const authHeader = request.headers.authorization;
    let userId: string | undefined;
    let ipAddress: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = (request.server as any).jwt?.decode(token) as any;
        userId = decoded?.id || decoded?._id;
      } catch {
        // ignore
      }
    }

    ipAddress = request.ip;

    const existing = await ContestVoteModel.findOne({
      contestantId,
      ...(userId ? { userId } : { ipAddress }),
    }).lean();

    if (existing) {
      return reply.status(400).send({ success: false, error: 'You have already voted for this contestant' });
    }

    await ContestVoteModel.create({
      contestVideoId: contestant.contestVideoId,
      contestantId,
      userId,
      ipAddress,
    });

    await ContestantModel.findByIdAndUpdate(contestantId, { $inc: { votes: 1 } });
    await ContestVideoModel.findByIdAndUpdate(contestant.contestVideoId, { $inc: { totalVotes: 1 } });

    const updated = await ContestantModel.findById(contestantId).lean();

    return reply.send({ success: true, data: { votes: updated?.votes || 1 } });
  } catch (error: any) {
    logger.error({ error }, 'Error voting for contestant');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getContestVotes = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { contestVideoId } = request.params as { contestVideoId: string };

    const contestants = await ContestantModel.find({ contestVideoId, isActive: true })
      .sort({ votes: -1 })
      .lean();

    return reply.send({
      success: true,
      data: contestants.map((c: any) => ({ id: c._id?.toString(), name: c.name, votes: c.votes })),
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting contest votes');
    return reply.status(500).send({ success: false, error: error.message });
  }
};
