import { FixedThreadPool, PoolOptions } from 'poolifier';

import Utils from '../utils/Utils';
import { Worker } from 'worker_threads';
import WorkerAbstract from './WorkerAbstract';
import { WorkerData } from '../types/Worker';
import { WorkerUtils } from './WorkerUtils';

export default class WorkerStaticPool<T> extends WorkerAbstract {
  private pool: FixedThreadPool<WorkerData>;

  /**
   * Create a new `WorkerStaticPool`.
   *
   * @param {string} workerScript
   * @param {number} numberOfThreads
   * @param {number} startWorkerDelay
   * @param {PoolOptions} opts
   */
  constructor(workerScript: string, numberOfThreads: number, startWorkerDelay?: number, opts?: PoolOptions<Worker>) {
    super(workerScript, startWorkerDelay);
    opts.exitHandler = opts?.exitHandler ?? WorkerUtils.defaultExitHandler;
    this.pool = new FixedThreadPool(numberOfThreads, this.workerScript, opts);
  }

  get size(): number {
    return this.pool.workers.length;
  }

  get maxElementsPerWorker(): number | null {
    return null;
  }

  /**
   *
   * @returns {Promise<void>}
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async start(): Promise<void> {}

  /**
   *
   * @returns {Promise<void>}
   * @public
   */
  public async stop(): Promise<void> {
    return this.pool.destroy();
  }

  /**
   *
   * @param {T} elementData
   * @returns {Promise<void>}
   * @public
   */
  public async addElement(elementData: T): Promise<void> {
    await this.pool.execute(elementData);
    // Start worker sequentially to optimize memory at startup
    await Utils.sleep(this.workerStartDelay);
  }
}
