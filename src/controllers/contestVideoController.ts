import type { FastifyRequest, FastifyReply } from 'fastify';
import { ContestVideoModel } from '../models/ContestVideo';
import { ContestantModel } from '../models/Contestant';
import { ContestPurchaseModel } from '../models/ContestPurchase';
import { UserModel } from '../models/User';
import { SettingsModel } from '../models/Settings';
import { logger } from '../lib/logger';
import { buildRefUpdate, sanitizeRefFields } from '../lib/sanitizeRefs';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const getAllContestVideos = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const query = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      featured?: string;
      trending?: string;
    };

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.featured === 'true') filter.featured = true;
    if (query.trending === 'true') filter.trending = true;

    if (query.search) {
      filter.$or = [
        { title: new RegExp(query.search, 'i') },
        { description: new RegExp(query.search, 'i') },
      ];
    }

    const [videos, total] = await Promise.all([
      ContestVideoModel.find(filter)
        .populate('genre', 'name')
        .populate('category', 'name')
        .populate('language', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContestVideoModel.countDocuments(filter),
    ]);

    return reply.send({
      success: true,
      data: videos.map((v: any) => ({ ...v, id: v._id?.toString() })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting all contest videos');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getContestVideoById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await ContestVideoModel.findById(id)
      .populate('genre', 'name')
      .populate('category', 'name')
      .populate('language', 'name')
      .lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Contest video not found' });
    }

    return reply.send({ success: true, data: { ...video, id: video._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error getting contest video by ID');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const createContestVideo = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = request.body as any;
    const { set: videoData } = sanitizeRefFields(body);

    if (!videoData.title || !videoData.videoUrl) {
      return reply.status(400).send({ success: false, error: 'title and videoUrl are required' });
    }

    const video = await ContestVideoModel.create(videoData);

    return reply.status(201).send({
      success: true,
      data: { ...video.toObject(), id: video._id?.toString() },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error creating contest video');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const updateContestVideo = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const update = buildRefUpdate(body);

    if (!update.$set && !update.$unset) {
      return reply.status(400).send({ success: false, error: 'No fields to update' });
    }

    const video = await ContestVideoModel.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true });

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Contest video not found' });
    }

    return reply.send({ success: true, data: { ...video.toObject(), id: video._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error updating contest video');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const deleteContestVideo = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await ContestVideoModel.findByIdAndDelete(id);

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Contest video not found' });
    }

    return reply.send({ success: true, message: 'Contest video deleted successfully' });
  } catch (error: any) {
    logger.error({ error }, 'Error deleting contest video');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const toggleContestVideoFeatured = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await ContestVideoModel.findById(id).lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Contest video not found' });
    }

    const updated = await ContestVideoModel.findByIdAndUpdate(id, { $set: { featured: !video.featured } }, { returnDocument: 'after' }).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling contest video featured');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const toggleContestVideoTrending = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await ContestVideoModel.findById(id).lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Contest video not found' });
    }

    const updated = await ContestVideoModel.findByIdAndUpdate(id, { $set: { trending: !video.trending } }, { returnDocument: 'after' }).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling contest video trending');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getPublicContestVideos = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const query = request.query as any;
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 20)));

    const filter: any = { status: 'published' };

    if (query.featured === 'true') filter.featured = true;
    if (query.trending === 'true') filter.trending = true;
    if (query.genre) filter.genre = query.genre;
    if (query.category) filter.category = query.category;
    if (query.language) filter.language = query.language;

    if (query.search) {
      filter.$or = [
        { title: new RegExp(query.search, 'i') },
        { description: new RegExp(query.search, 'i') },
      ];
    }

    const [videos, total] = await Promise.all([
      ContestVideoModel.find(filter)
        .populate('genre', 'name')
        .sort(query.trending === 'true' ? { views: -1 } : { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContestVideoModel.countDocuments(filter),
    ]);

    return reply.send({
      success: true,
      data: videos.map((v: any) => ({ ...v, id: v._id?.toString() })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting public contest videos');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getPublicContestVideoById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await ContestVideoModel.findById(id)
      .populate('genre', 'name')
      .populate('category', 'name')
      .populate('language', 'name')
      .lean();

    if (!video || video.status !== 'published') {
      return reply.status(404).send({ success: false, error: 'Contest not found' });
    }

    let hasAccess = video.price <= 0;
    let purchase = null as any;

    if (!hasAccess) {
      const authHeader = request.headers.authorization;
      let userId: string | undefined;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.substring(7);
          const decoded = (request.server as any).jwt?.decode(token) as any;
          userId = decoded?.id || decoded?._id;
        } catch {
          // ignore
        }
      }

      if (userId) {
        purchase = await ContestPurchaseModel.findOne({
          contestVideoId: id,
          userId,
          status: 'completed',
          watchGranted: true,
        }).lean();
      }

      if (purchase) {
        hasAccess = true;
      } else if (!video.allowGuestPurchase) {
        hasAccess = false;
      } else {
        const guestEmail = (request.query as any).guest_email;
        if (guestEmail) {
          purchase = await ContestPurchaseModel.findOne({
            contestVideoId: id,
            email: guestEmail,
            status: 'completed',
            watchGranted: true,
          }).lean();
          hasAccess = !!purchase;
        }
      }
    }

    const contestants = await ContestantModel.find({ contestVideoId: id, isActive: true })
      .sort({ order: 1 })
      .lean();

    return reply.send({
      success: true,
      data: {
        ...video,
        id: video._id?.toString(),
        hasAccess,
        contestants: contestants.map((c: any) => ({ ...c, id: c._id?.toString() })),
      },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting public contest video by ID');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const initiateContestPurchase = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const { name, email, phone } = request.body as { name: string; email: string; phone: string };

    const video = await ContestVideoModel.findById(id).lean();
    if (!video || video.status !== 'published') {
      return reply.status(404).send({ success: false, error: 'Contest not found' });
    }

    if (video.price <= 0) {
      return reply.status(400).send({ success: false, error: 'This contest is free' });
    }

    if (!name || !email || !phone) {
      return reply.status(400).send({ success: false, error: 'name, email and phone are required' });
    }

    const authHeader = request.headers.authorization;
    let userId: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = (request.server as any).jwt?.decode(token) as any;
        userId = decoded?.id || decoded?._id;
      } catch {
        // ignore
      }
    }

    if (userId) {
      const existing = await ContestPurchaseModel.findOne({
        contestVideoId: id,
        userId,
        status: 'completed',
        watchGranted: true,
      }).lean();
      if (existing) {
        return reply.send({ success: true, data: { message: 'Already purchased', watchGranted: true } });
      }
    }

    const settings = await SettingsModel.findOne().lean();
    if (!settings?.razorpayEnabled || !settings?.razorpayKeyId || !settings?.razorpayKeySecret) {
      return reply.status(400).send({ success: false, error: 'Payment gateway is not configured. Please contact support.' });
    }

    const instance = new Razorpay({
      key_id: settings.razorpayKeyId,
      key_secret: settings.razorpayKeySecret,
    });

    const amountInPaise = Math.round(video.price * 100);
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: video.currency || 'INR',
      receipt: `contest_${id}_${Date.now()}`,
      notes: { contestVideoId: id, name, email, phone, userId: userId || '' },
    });

    const purchase = await ContestPurchaseModel.create({
      contestVideoId: id,
      userId,
      name,
      email,
      phone,
      amount: video.price,
      currency: video.currency || 'INR',
      razorpayOrderId: order.id,
      status: 'pending',
      watchGranted: false,
    });

    return reply.send({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        purchaseId: purchase._id?.toString(),
      },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error initiating contest purchase');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const verifyContestPurchase = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { order_id, payment_id, signature } = request.body as { order_id: string; payment_id: string; signature: string };

    if (!order_id || !payment_id || !signature) {
      return reply.status(400).send({ success: false, error: 'order_id, payment_id and signature are required' });
    }

    const settings = await SettingsModel.findOne().lean();
    if (!settings?.razorpayEnabled || !settings?.razorpayKeySecret) {
      return reply.status(400).send({ success: false, error: 'Razorpay is not configured' });
    }

    const text = `${order_id}|${payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', settings.razorpayKeySecret)
      .update(text)
      .digest('hex');

    if (generated_signature !== signature) {
      return reply.status(400).send({ success: false, error: 'Invalid payment signature' });
    }

    const purchase = await ContestPurchaseModel.findOne({ razorpayOrderId: order_id }).lean();
    if (!purchase) {
      return reply.status(404).send({ success: false, error: 'Purchase record not found' });
    }

    await ContestPurchaseModel.findByIdAndUpdate(purchase._id, {
      razorpayPaymentId: payment_id,
      razorpaySignature: signature,
      status: 'completed',
      watchGranted: true,
    });

    return reply.send({ success: true, data: { watchGranted: true } });
  } catch (error: any) {
    logger.error({ error }, 'Error verifying contest purchase');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const checkContestAccess = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await ContestVideoModel.findById(id).lean();
    if (!video || video.status !== 'published') {
      return reply.status(404).send({ success: false, error: 'Contest not found' });
    }

    if (video.price <= 0) {
      return reply.send({ success: true, data: { hasAccess: true } });
    }

    const authHeader = request.headers.authorization;
    let userId: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = (request.server as any).jwt?.decode(token) as any;
        userId = decoded?.id || decoded?._id;
      } catch {
        // ignore
      }
    }

    if (userId) {
      const purchase = await ContestPurchaseModel.findOne({
        contestVideoId: id,
        userId,
        status: 'completed',
        watchGranted: true,
      }).lean();
      if (purchase) {
        return reply.send({ success: true, data: { hasAccess: true } });
      }
    }

    const guestEmail = (request.query as any).guest_email;
    if (guestEmail) {
      const purchase = await ContestPurchaseModel.findOne({
        contestVideoId: id,
        email: guestEmail,
        status: 'completed',
        watchGranted: true,
      }).lean();
      if (purchase) {
        return reply.send({ success: true, data: { hasAccess: true } });
      }
    }

    return reply.send({ success: true, data: { hasAccess: false } });
  } catch (error: any) {
    logger.error({ error }, 'Error checking contest access');
    return reply.status(500).send({ success: false, error: error.message });
  }
};
