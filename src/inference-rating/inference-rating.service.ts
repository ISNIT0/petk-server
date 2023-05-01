import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';
import { InferenceRating } from 'src/database/entity/InferenceRating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InferenceRatingService {
  constructor(
    @InjectRepository(Inference)
    private inferenceRepo: Repository<Inference>,
    @InjectRepository(InferenceRating)
    private inferenceRatingRepo: Repository<InferenceRating>,
  ) {}

  async rateInference(
    authContext: IAuthenticatedContext,
    inferenceId: string,
    rating: { rating: number; context?: Record<string, any> },
  ) {
    const inference = await this.inferenceRepo.findOneOrFail({
      where: { id: inferenceId, session: { org: { id: authContext.org.id } } },
    });

    let inferenceRating = new InferenceRating();
    inferenceRating.inference = inference;
    inferenceRating.profile = { id: authContext.profile.id } as any;
    inferenceRating.rating = rating.rating;
    inferenceRating.context = rating.context;
    inferenceRating = await this.inferenceRatingRepo.save(inferenceRating);

    return inferenceRating;
  }

  async getRatingsForInference(
    authContext: IAuthenticatedContext,
    inferenceId: string,
  ) {
    const inference = await this.inferenceRepo.findOneOrFail({
      where: { id: inferenceId, session: { org: { id: authContext.org.id } } },
      relations: { ratings: true },
    });

    return inference.ratings;
  }

  async deleteRating(
    authContext: IAuthenticatedContext,
    inferenceId: string,
    ratingId: string,
  ) {
    return this.inferenceRatingRepo.delete({
      id: ratingId,
      inference: {
        id: inferenceId,
        session: { org: { id: authContext.org.id } },
      },
    });
  }

  async getAll(authContext: IAuthenticatedContext) {
    return this.inferenceRatingRepo.find({
      where: { inference: { session: { org: { id: authContext.org.id } } } },
      relations: {
        inference: { session: true },
      },
    });
  }
}
